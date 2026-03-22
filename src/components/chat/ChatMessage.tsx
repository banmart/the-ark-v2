import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatMessage = ({ role, content, timestamp }: ChatMessageProps) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser 
          ? 'bg-cyan-500/20 border border-cyan-500/30' 
          : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-cyan-400" />
        ) : (
          <Bot className="w-4 h-4 text-purple-400" />
        )}
      </div>
      
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-3 rounded-xl text-sm ${
          isUser
            ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-100 font-mono'
            : 'bg-gray-800/50 border border-gray-700/50 text-gray-200'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-ol:my-1.5 prose-li:my-0.5 prose-headings:my-2 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-code:text-cyan-300 prose-code:bg-black/30 prose-code:px-1 prose-code:rounded">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>
        
        <div className={`mt-1 text-xs text-gray-500 font-mono ${isUser ? 'text-right' : 'text-left'}`}>
          {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
