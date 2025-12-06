import React, { useState, useRef, useEffect } from 'react';
import { MessageCircleQuestion, X, Send, Bot } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { Message } from '../types';

const HelpChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "Hi! I'm the Well Mind AI Help Assistant. How can I help you navigate the app or find information?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
        const response = await sendChatMessage(messages, input);
        setMessages(prev => [...prev, response]);
    } catch (e) {
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble right now.", timestamp: new Date() }]);
    }
    
    setLoading(false);
  };

  return (
    <div className="fixed bottom-20 right-6 z-[50] flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 h-[450px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in duration-300 overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="font-bold text-sm">Quick Help</h3>
                <p className="text-[10px] opacity-80">Ask about features or health tips</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs md:text-sm shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-slate-200 dark:border-slate-700">
                    <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your question..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-1 focus:ring-teal-500 outline-none"
            />
            <button 
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-teal-600 hover:bg-teal-500 text-white p-4 rounded-full shadow-xl shadow-teal-600/30 hover:scale-105 transition-all duration-300 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircleQuestion size={24} />}
      </button>
    </div>
  );
};

export default HelpChatWidget;