
import React, { useState, KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim() || isLoading) return;
    onSendMessage(message.trim());
    setMessage('');
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 px-6">
      <div className="flex gap-4 items-end">
        <div className="flex-1 relative group">
          {/* Input Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-2xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Interrogate the Oracle of the Ark..."
            className="relative w-full bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 text-white font-mono text-sm resize-none focus:border-cyan-500/50 focus:outline-none transition-all placeholder:text-white/20 scrollbar-none"
            rows={1}
            style={{ minHeight: '56px', maxHeight: '160px' }}
            disabled={isLoading}
          />
        </div>
        
        <button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="relative group flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all active:scale-90 disabled:opacity-20 disabled:grayscale"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-shadow" />
          <Send className="relative w-6 h-6 text-black" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
