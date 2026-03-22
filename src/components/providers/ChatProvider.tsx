import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CHAT_ASSISTANT_FUNCTION_NAME } from '@/lib/chat/constants';
import { getFunctionErrorMessage } from '@/lib/chat/errors';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  isOpen: boolean;
  addMessage: (content: string, role: 'user' | 'assistant') => void;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
  setIsOpen: (open: boolean) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

const CHAT_STORAGE_KEY = 'ark-chat-history';
const CHAT_VERSION_KEY = 'ark-chat-history-version';
const CHAT_VERSION = 'v4';

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const savedVersion = localStorage.getItem(CHAT_VERSION_KEY);
    if (savedVersion !== CHAT_VERSION) {
      localStorage.removeItem(CHAT_STORAGE_KEY);
      localStorage.setItem(CHAT_VERSION_KEY, CHAT_VERSION);
      return [];
    }

    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => {
      const updated = [...prev, newMessage];
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    addMessage(content, 'user');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      
      const { data, error } = await supabase.functions.invoke(CHAT_ASSISTANT_FUNCTION_NAME, {
        body: { message: content, chatHistory }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const reply = data?.response || 'Sorry, I couldn\'t generate a response. Please try again.';
      addMessage(reply, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = await getFunctionErrorMessage(error, 'Sorry, I encountered an error. Please try again.');
      addMessage(errorMessage, 'assistant');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, isLoading, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
  }, []);

  const value = {
    messages,
    isLoading,
    isOpen,
    addMessage,
    sendMessage,
    clearChat,
    setIsOpen,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
