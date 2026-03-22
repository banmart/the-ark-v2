import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumBackground from '../components/layout/PremiumBackground';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { supabase } from '@/integrations/supabase/client';

interface OnboardingMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'ark-onboarding-chat';

const audienceOptions = [
  { label: "I'm brand new to crypto", value: "A) I'm brand new to crypto — never bought anything" },
  { label: "I have a Coinbase account", value: "B) I have a Coinbase account but no wallet yet" },
  { label: "I have MetaMask / a wallet", value: "C) I have MetaMask or another wallet but haven't used PulseChain" },
  { label: "I'm already on PulseChain", value: "D) I'm already on PulseChain and just need to swap for ARK" },
];

const Onboarding = () => {
  const [messages, setMessages] = useState<OnboardingMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved).map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
      } catch { return []; }
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const persist = useCallback((msgs: OnboardingMessage[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  }, []);

  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = useCallback((content: string, role: 'user' | 'assistant') => {
    const msg: OnboardingMessage = { id: Date.now().toString(), role, content, timestamp: new Date() };
    setMessages(prev => {
      const updated = [...prev, msg];
      persist(updated);
      return updated;
    });
  }, [persist]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;
    addMessage(content, 'user');
    setIsLoading(true);

    try {
      const chatHistory = messages.map(m => ({ role: m.role, content: m.content }));
      const { data, error } = await supabase.functions.invoke('chat-assistant', {
        body: { message: content, chatHistory }
      });
      if (error) throw error;
      addMessage(data?.response || 'Sorry, please try again.', 'assistant');
    } catch (err) {
      console.error('Onboarding chat error:', err);
      addMessage('Sorry, I encountered an error. Please try again.', 'assistant');
    } finally {
      setIsLoading(false);
    }
  }, [addMessage, isLoading, messages]);

  const clearChat = useCallback(() => {
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="h-[100dvh] flex flex-col bg-black text-white relative overflow-hidden overscroll-none">
      <PremiumBackground variant="onboarding" particleCount={12} />

      {/* Compact top bar */}
      <div className="relative z-20 flex-shrink-0 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-1.5 -ml-1.5 text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-full blur-sm" />
              <div className="relative w-7 h-7 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center">
                <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-[11px] font-bold font-mono tracking-wide bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
                ARK ONBOARDING
              </h1>
              <p className="text-[10px] text-white/40 font-mono">
                {isLoading ? 'Thinking...' : 'Step-by-step crypto coach'}
              </p>
            </div>
          </div>

          {hasMessages && (
            <button
              onClick={clearChat}
              className="p-2 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
              title="Start over"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Chat area */}
      <div ref={chatAreaRef} className="relative z-10 flex-1 overflow-y-auto min-h-0">
        <div className="max-w-3xl mx-auto px-4 py-4">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
              <div className="mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-xl mb-4">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span className="text-[10px] font-mono text-white/60 tracking-widest">AI-POWERED ONBOARDING</span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                  Let's get you onboard ⚓
                </h2>
                <p className="text-white/50 text-sm max-w-sm mx-auto leading-relaxed">
                  I'll walk you through every step — from zero to holding ARK. Where are you starting?
                </p>
              </div>

              <div className="w-full max-w-sm space-y-2">
                {audienceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => sendMessage(opt.value)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-200 group disabled:opacity-50"
                  >
                    <span className="text-sm text-white/80 group-hover:text-cyan-300 transition-colors font-mono">
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 text-white/40 font-mono text-sm p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span>Thinking...</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Input pinned at bottom */}
      {hasMessages && (
        <div className="relative z-10 flex-shrink-0 border-t border-white/[0.06] bg-black/80 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-3xl mx-auto">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
