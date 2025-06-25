
import React, { useEffect, useRef } from 'react';
import { Trash2, Minimize2 } from 'lucide-react';
import { useChatContext } from '../providers/ChatProvider';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatAssistant = () => {
  const { messages, isLoading, sendMessage, clearChat, setIsOpen } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickActions = [
    "How do I buy ARK tokens?",
    "What are the locker tiers?",
    "How does the bridge work?",
    "Tell me about ARK's tokenomics"
  ];

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div>
            <h3 className="font-bold text-cyan-400 font-mono">ARK Assistant</h3>
            <p className="text-xs text-gray-400 font-mono">
              {isLoading ? 'Thinking...' : 'Ready to help'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close chat"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
              Welcome to ARK Assistant!
            </h3>
            <p className="text-gray-400 mb-6 font-mono text-sm">
              I'm here to help you navigate ARK tokens, bridges, and Coinbase integration.
            </p>
            
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-mono mb-3">Quick actions:</p>
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="block w-full text-left p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all duration-200 text-sm font-mono text-gray-300"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
              />
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                <span className="ml-2">ARK Assistant is thinking...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatAssistant;
