'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, X, Minimize2, User, Bot, Sparkles } from 'lucide-react';

export default function ChatBot() {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  const quickActions = [
    "Track my order",
    "Shipping information", 
    "Return policy",
    "Product help",
    "Payment issues"
  ];

  const handleQuickAction = (message: string) => {
    setInput(message);
    handleSubmit(new Event('submit') as any);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-green-400 shadow-lg hover:shadow-xl transition-all duration-300 relative"
          style={{ backgroundColor: "#25D366" }}
        >
          <Bot className="w-8 h-8 text-white transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">1</span>
          </div>
          <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
        </Button>
      ) : (
        <div className={`bg-white rounded-lg shadow-2xl border transition-all duration-300 ${isMinimized ? 'w-80 h-20' : 'w-80 h-96'}`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-400 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-white text-sm">
                  <Sparkles className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">AI Agent</h3>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-xs text-green-100">{isLoading ? 'Typing...' : 'Online'}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 p-1" onClick={() => setIsMinimized(!isMinimized)}>
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-green-600 p-1" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    {/* Welcome */}
                    <div className="flex items-start space-x-2">
                      <Avatar className="w-6 h-6 mt-1">
                        <AvatarFallback className="bg-gradient-to-r from-green-100 to-green-200 text-green-600 text-xs">
                          <Bot className="w-3 h-3" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white rounded-lg rounded-tl-sm p-3 shadow-sm max-w-[85%]">
                        <p className="text-sm text-gray-800">👋 Hi! I'm your Essa.store AI assistant. How can I help you today?</p>
                        <span className="text-xs text-gray-500 mt-1 block">{formatTime(new Date())}</span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex flex-wrap gap-2 px-8">
                      {quickActions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 bg-gradient-to-r from-green-50 to-green-100 border-green-200 text-green-700 hover:from-green-100 hover:to-green-200"
                          onClick={() => handleQuickAction(action)}
                        >
                          {action}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                  >
                    <Avatar className="w-6 h-6 mt-1">
                      <AvatarFallback
                        className={`text-xs ${
                          message.role === 'user' ? 'bg-green-100 text-green-600' : 'bg-gradient-to-r from-green-100 to-green-200 text-green-600'
                        }`}
                      >
                        {message.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 shadow-sm max-w-[85%] ${
                        message.role === 'user' ? 'bg-green-500 text-white rounded-tr-sm' : 'bg-white text-gray-800 rounded-tl-sm'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <span className={`text-xs mt-1 block ${message.role === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                        {formatTime(new Date(message.createdAt || Date.now()))}
                      </span>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="w-6 h-6 mt-1">
                      <AvatarFallback className="bg-gradient-to-r from-green-100 to-green-200 text-green-600 text-xs">
                        <Bot className="w-3 h-3" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white rounded-lg rounded-tl-sm p-3 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-300 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t bg-white rounded-b-lg">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    className="flex-1 text-sm"
                    disabled={isLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    size="sm"
                    className="bg-gradient-to-r from-green-500 to-green-400 hover:from-green-600 hover:to-green-500"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500">Powered by M Essa Gadani</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
