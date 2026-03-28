import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2, Sparkles, MessageCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PremiumBackground from '../components/layout/PremiumBackground';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { supabase } from '@/integrations/supabase/client';
import { CHAT_ASSISTANT_FUNCTION_NAME } from '@/lib/chat/constants';
import { getFunctionErrorMessage } from '@/lib/chat/errors';

interface OnboardingMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = 'ark-onboarding-chat';
const CHAT_VERSION = 'v4';
const VERSION_KEY = 'ark-onboarding-chat-version';

const audienceOptions = [
  { label: "I'm brand new to crypto", value: "A) I'm brand new to crypto — never bought anything" },
  { label: "I have a Coinbase account", value: "B) I have a Coinbase account but no wallet yet" },
  { label: "I have MetaMask / a wallet", value: "C) I have MetaMask or another wallet but haven't used PulseChain" },
  { label: "I'm already on PulseChain", value: "D) I'm already on PulseChain and just need to swap for ARK" },
];

const Onboarding = () => {
  const [messages, setMessages] = useState<OnboardingMessage[]>(() => {
    const savedVersion = localStorage.getItem(VERSION_KEY);
    if (savedVersion !== CHAT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CHAT_VERSION);
      return [];
    }
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
      const { data, error } = await supabase.functions.invoke(CHAT_ASSISTANT_FUNCTION_NAME, {
        body: { message: content, chatHistory }
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      addMessage(data?.response || 'Sorry, please try again.', 'assistant');
    } catch (err) {
      console.error('Onboarding chat error:', err);
      const errorMessage = await getFunctionErrorMessage(err, 'Sorry, I encountered an error. Please try again.');
      addMessage(errorMessage, 'assistant');
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
    <div className="h-[100dvh] flex flex-col bg-black text-white relative overflow-hidden overscroll-none font-sans">
      <PremiumBackground />

      {/* Premium Top Navigation Bar */}
      <div className="relative z-20 flex-shrink-0 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 -ml-2 text-white/40 hover:text-white transition-all hover:scale-110 active:scale-95">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-9 h-9 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                  <MessageCircle className="w-4 h-4 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-[10px] font-black font-mono tracking-[0.3em] text-white/40 uppercase">
                  [SYSTEM.RECRUITMENT]
                </h1>
                <p className="text-xs font-bold text-white tracking-tight">Onboarding Protocol</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Oracle Thinking</span>
              </div>
            )}
            {hasMessages && (
              <button
                onClick={clearChat}
                className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/30 hover:text-red-400 hover:border-red-400/30 hover:bg-red-500/5 transition-all active:scale-90"
                title="Start over"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatAreaRef} className="relative z-10 flex-1 overflow-y-auto min-h-0 scrollbar-none">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {!hasMessages ? (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-up">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 mb-8 backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-mono text-white/40 tracking-[0.3em] uppercase">Initiation Sequence</span>
                </div>

                <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent tracking-tighter uppercase leading-[0.9]">
                  Welcome to <br />
                  <span className="text-white">The Sanctuary ⚓</span>
                </h2>
                
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-8" />
                
                <p className="text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed font-mono uppercase tracking-tighter italic">
                  Complete these sacred steps to hold the Ark. Where does your journey begin?
                </p>
              </div>

              <div className="w-full max-w-md grid grid-cols-1 gap-3">
                {audienceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => sendMessage(opt.value)}
                    disabled={isLoading}
                    className="relative group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative w-full text-center px-6 py-4 liquid-glass rounded-2xl border border-white/10 hover:border-cyan-500/40 transition-all duration-300 group-active:scale-98">
                      <span className="text-sm text-white font-mono uppercase tracking-wider group-hover:text-cyan-400 transition-colors">
                        {opt.label}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  timestamp={msg.timestamp}
                />
              ))}

              {isLoading && (
                <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="w-9 h-9 rounded-xl bg-white/[0.03] border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 text-cyan-400 animate-spin border-2 border-cyan-400 border-t-transparent rounded-full" />
                  </div>
                  <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm">
                    <span className="text-xs font-mono text-cyan-400/80 uppercase tracking-[0.2em] animate-pulse">Consulting the Protocol...</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Input Pinned at Bottom */}
      {hasMessages && (
        <div className="relative z-10 flex-shrink-0 border-t border-white/5 bg-black/60 backdrop-blur-3xl pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Onboarding;
