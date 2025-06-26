
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

  // Enhanced quick actions with better customer service focus
  const quickActions = [
    {
      category: "Getting Started",
      actions: [
        "How do I buy ARK tokens?",
        "What makes ARK different?",
        "How do reflections work?"
      ]
    },
    {
      category: "Sacred Locker",
      actions: [
        "Explain the locker tiers",
        "Which tier should I choose?",
        "How do I lock my ARK?"
      ]
    },
    {
      category: "Bridge & Setup",
      actions: [
        "How do I bridge to PulseChain?",
        "Help with wallet setup",
        "Bridge troubleshooting"
      ]
    },
    {
      category: "Advanced",
      actions: [
        "ARK tokenomics breakdown",
        "Maximizing rewards strategy",
        "Community and governance"
      ]
    }
  ];

  const handleQuickAction = (action: string) => {
    sendMessage(action);
  };

  const welcomeMessage = messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-4 border-b border-cyan-500/20 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-lg">⚓</span>
          </div>
          <div>
            <h3 className="font-bold text-cyan-400 font-mono">ARK Assistant</h3>
            <p className="text-xs text-gray-400 font-mono">
              {isLoading ? 'Navigating your request...' : 'Your friendly ARK guide'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={clearChat}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Clear chat history"
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
        {welcomeMessage ? (
          <div className="text-center py-4">
            <div className="text-6xl mb-4">⚓</div>
            <h3 className="text-xl font-bold text-cyan-400 mb-2 font-mono">
              Welcome aboard THE ARK! 🚀
            </h3>
            <p className="text-gray-300 mb-6 font-mono text-sm leading-relaxed">
              I'm your friendly ARK Assistant, here to help you navigate our revolutionary ecosystem!<br/>
              <span className="text-cyan-400">Ask me anything about tokenomics, bridging, or getting started.</span>
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              {quickActions.map((category, categoryIndex) => (
                <div key={categoryIndex} className="text-left">
                  <h4 className="text-xs font-bold text-cyan-300 mb-2 font-mono uppercase tracking-wider">
                    {category.category}
                  </h4>
                  <div className="space-y-1">
                    {category.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={() => handleQuickAction(action)}
                        className="block w-full text-left p-3 bg-gray-800/30 border border-gray-700/30 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-200 text-sm font-mono text-gray-300 hover:text-cyan-300"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-3 bg-teal-500/10 border border-teal-500/30 rounded-lg">
              <p className="text-xs text-teal-300 font-mono">
                💡 <strong>Pro Tip:</strong> I'm here to help with everything from basic questions to advanced strategies. Don't hesitate to ask!
              </p>
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
              <div className="flex items-center gap-2 text-gray-400 font-mono text-sm p-3 bg-gray-800/30 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="ml-2">Your ARK Assistant is thinking...</span>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Enhanced Input */}
      <div className="border-t border-cyan-500/20">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default ChatAssistant;
