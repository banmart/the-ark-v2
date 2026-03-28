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
      
      <div className={`flex-1 max-w-[85%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`relative p-5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-50 font-mono text-[13px] tracking-tight'
            : 'liquid-glass border-white/10 text-white/90 shadow-2xl backdrop-blur-3xl'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{content}</div>
          ) : (
            <div className="prose prose-sm prose-invert max-w-none 
              prose-p:mb-5 prose-p:leading-[1.8] 
              prose-ul:my-6 prose-ol:my-6 
              prose-li:my-3 
              prose-headings:mt-8 prose-headings:mb-4 
              prose-a:text-cyan-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline 
              prose-strong:text-white prose-strong:font-black
              prose-code:text-cyan-300 prose-code:bg-black/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
              prose-blockquote:border-cyan-500/50 prose-blockquote:bg-cyan-500/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg">
              <ReactMarkdown
                components={{
                  a: ({ href, children, ...props }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1" {...props}>
                      {children}
                    </a>
                  ),
                }}
              >{content}</ReactMarkdown>
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
