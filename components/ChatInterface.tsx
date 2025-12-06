import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Globe, Loader2, ExternalLink, Paperclip, Image as ImageIcon, X, FileText, Stethoscope, Pill, AlertTriangle, Search, AlertCircle } from 'lucide-react';
import { Message, Attachment, Doctor } from '../types';
import { sendChatMessage } from '../services/geminiService';
import { doctors } from './DoctorDirectory';
import ReactMarkdown from 'react-markdown';

interface ChatInterfaceProps {
  onSelectDoctor: (doctor: Doctor) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSelectDoctor }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "# Welcome to Well Mind AI \nI am capable of analyzing **medical images** (X-rays, skin issues) and **PDF reports** (Lab results, prescriptions). \n\nI can search the web to provide: \n*   🦠 Disease Predictions & Analysis\n*   💊 Latest Remedies & Treatments\n*   🛡️ Precautions & Safety Measures\n\n**How can I help you today?**",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]); 

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      
      const promise = new Promise<void>((resolve) => {
        reader.onload = (e) => {
          const base64String = (e.target?.result as string).split(',')[1];
          newAttachments.push({
            mimeType: file.type,
            data: base64String,
            name: file.name
          });
          resolve();
        };
      });
      
      reader.readAsDataURL(file);
      await promise;
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if ((!textToSend.trim() && attachments.length === 0) || loading) return;

    const userMsg: Message = {
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
      attachments: [...attachments]
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachments([]);
    setLoading(true);

    const response = await sendChatMessage(messages, userMsg.text, userMsg.attachments);

    setMessages(prev => [...prev, response]);
    setLoading(false);
  };

  const getRecommendedDoctors = (text: string): Doctor[] => {
    const match = text.match(/<<RECOMMEND:(.*?)>>/);
    if (match && match[1]) {
      const specialty = match[1].trim();
      return doctors.filter(d => d.specialty.toLowerCase().includes(specialty.toLowerCase()));
    }
    return [];
  };

  const QuickAction = ({ icon: Icon, label, prompt }: { icon: any, label: string, prompt: string }) => (
    <button 
      onClick={() => handleSend(prompt)}
      disabled={loading}
      className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-50 dark:hover:bg-slate-700 px-3 py-2 rounded-lg transition-all text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shadow-sm"
    >
      <Icon size={14} className="text-teal-600 dark:text-teal-400" />
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl overflow-hidden relative">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-950/80 backdrop-blur-md p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
            <Bot size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Dr. AI Consultant</h3>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Online • Search & Vision Enabled
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="hidden md:flex px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/20 rounded-full text-[10px] text-blue-600 dark:text-blue-400 items-center gap-1.5">
            <Globe size={12} />
            Live Medical Search
            </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {messages.map((msg, idx) => {
          const recommendedDocs = msg.role === 'model' ? getRecommendedDoctors(msg.text) : [];
          // Clean text by removing the tag
          const displayText = msg.text.replace(/<<RECOMMEND:.*?>>/, '');

          return (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-teal-600 text-white'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[85%] md:max-w-[75%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-md ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {/* Attachments */}
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {msg.attachments.map((att, aIdx) => (
                        <div key={aIdx} className="relative group overflow-hidden rounded-lg border border-white/10">
                           {att.mimeType.startsWith('image/') ? (
                             <img 
                               src={`data:${att.mimeType};base64,${att.data}`} 
                               alt="attachment" 
                               className="h-32 w-auto object-cover transition-transform hover:scale-105"
                             />
                           ) : (
                             <div className="h-20 w-32 bg-slate-100 dark:bg-slate-900/50 flex flex-col items-center justify-center text-xs p-2 text-center">
                               <FileText size={24} className="mb-1 opacity-70" />
                               <span className="truncate w-full text-[10px] opacity-90">{att.name || 'Document'}</span>
                               <span className="text-[9px] opacity-50 uppercase">{att.mimeType.split('/')[1]}</span>
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="markdown-content space-y-2">
                    <ReactMarkdown 
                      components={{
                        h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 pb-1 border-b border-slate-200 dark:border-slate-600" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-base font-bold mt-4 mb-2 text-teal-600 dark:text-teal-400" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-slate-900 dark:text-teal-200" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="text-slate-700 dark:text-slate-300" {...props} />,
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                      }}
                    >
                      {displayText}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Recommended Doctors Widget */}
                {recommendedDocs.length > 0 && (
                  <div className="mt-3 w-full max-w-md animate-in slide-in-from-left-4 duration-500">
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-teal-200 dark:border-teal-500/30 rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase flex items-center gap-1">
                          <Stethoscope size={12} /> Recommended Specialists
                        </p>
                      </div>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
                        {recommendedDocs.map(doc => (
                          <div key={doc.id} className="min-w-[200px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-3 flex flex-col hover:border-teal-500/50 transition-colors shadow-sm">
                            <div className="flex items-center gap-3 mb-2">
                              <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover bg-slate-200" />
                              <div className="flex-1 overflow-hidden">
                                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{doc.hospital}</p>
                              </div>
                            </div>
                            <div className="mt-auto flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">{doc.experience} yrs exp</span>
                              <button 
                                onClick={() => onSelectDoctor(doc)}
                                className="text-[10px] bg-teal-600 hover:bg-teal-500 text-white px-2 py-1 rounded transition-colors"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Grounding Sources */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 pl-1">
                    {msg.sources.map((source, sIdx) => (
                      <a 
                        key={sIdx}
                        href={source.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full transition-colors"
                      >
                        <ExternalLink size={10} />
                        {source.title}
                      </a>
                    ))}
                  </div>
                )}
                
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 px-1 opacity-70">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            </div>
          );
        })}
        
        {loading && (
          <div className="flex gap-4 animate-pulse">
            <div className="w-8 h-8 bg-teal-600/50 rounded-full flex items-center justify-center text-white">
              <Bot size={16} />
            </div>
            <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm">
              <Loader2 size={16} className="animate-spin text-teal-600 dark:text-teal-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Analyzing medical data & checking sources...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-3 transition-colors shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.1)]">
        
        {/* Quick Actions (Only show if empty chat or user is idle) */}
        {messages.length < 3 && (
           <div className="flex gap-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
             <QuickAction icon={Stethoscope} label="Analyze Symptoms" prompt="I have a headache, fever, and skin rash. What could it be?" />
             <QuickAction icon={FileText} label="Read Lab Report" prompt="I am uploading a blood test report. Please analyze the abnormal values." />
             <QuickAction icon={Pill} label="Find Remedy" prompt="What are effective home remedies for a sore throat?" />
             <QuickAction icon={AlertTriangle} label="Drug Interactions" prompt="Check interactions between Ibuprofen and Amoxicillin." />
           </div>
        )}

        {/* Attachment Previews */}
        {attachments.length > 0 && (
          <div className="flex gap-3 mb-3 overflow-x-auto pb-2 px-1">
            {attachments.map((att, idx) => (
              <div key={idx} className="relative flex-shrink-0 group animate-in zoom-in duration-200">
                {att.mimeType.startsWith('image/') ? (
                  <img src={`data:${att.mimeType};base64,${att.data}`} className="h-14 w-14 object-cover rounded-lg border border-slate-200 dark:border-slate-600 shadow-lg" alt="preview" />
                ) : (
                  <div className="h-14 w-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex flex-col items-center justify-center border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 shadow-lg">
                    <FileText size={20} />
                    <span className="text-[8px] uppercase mt-1 truncate w-12 text-center">{att.name}</span>
                  </div>
                )}
                <button 
                  onClick={() => removeAttachment(idx)}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-0.5 shadow-md transition-colors z-10"
                >
                  <X size={10} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 relative">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden" 
            multiple 
            accept="image/*,application/pdf"
          />
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="group flex-shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 h-[48px] w-[48px] flex items-center justify-center rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-teal-900/10 dark:hover:shadow-teal-900/20 hover:border-teal-500/30"
            title="Upload Medical Report (PDF) or Image"
          >
            <div className="relative">
                 <Paperclip size={20} className="group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                 {attachments.length > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-teal-500 text-white text-[10px] flex items-center justify-center rounded-full border border-slate-100 dark:border-slate-900">
                        {attachments.length}
                    </span>
                 )}
            </div>
          </button>

          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Describe symptoms..."
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/50 transition-all resize-none h-[48px] max-h-[120px] leading-normal"
              rows={1}
            />
          </div>

          <button
            onClick={() => handleSend()}
            disabled={loading || (!input.trim() && attachments.length === 0)}
            className="h-[48px] w-[48px] bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-lg shadow-teal-500/20"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;