'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, createChatSession, getChatSessions, getChatHistory } from '@/lib/chat/chatApi';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSessionId = typeof window !== 'undefined' ? localStorage.getItem('currentChatSessionId') : null;
    if (savedSessionId) {
      setSessionId(savedSessionId);
      console.log('[ChatWidget] Restored session from localStorage:', savedSessionId);
    }
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history when session ID changes
  useEffect(() => {
    const loadHistory = async () => {
      if (!sessionId) return;
      
      try {
        const history = await getChatHistory(sessionId);
        const loadedMessages: Message[] = history.map((msg, idx) => ({
          id: `${sessionId}-${idx}`,
          role: msg.role,
          content: msg.content,
          timestamp: new Date()
        }));
        setMessages(loadedMessages);
      } catch (err) {
        console.log('[ChatWidget] No history found for session:', sessionId);
      }
    };

    loadHistory();
  }, [sessionId]);

  // Load user's sessions when chat opens
  useEffect(() => {
    const loadSessions = async () => {
      if (!isOpen) return;
      
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const sessions = await getChatSessions();
        
        if (sessions && sessions.length > 0) {
          // If no session is loaded, load the most recent one
          if (!sessionId) {
            const latestSession = sessions[0];
            setSessionId(latestSession._id);
            localStorage.setItem('currentChatSessionId', latestSession._id);
          }
        }
      } catch (err) {
        console.log('[ChatWidget] No previous sessions found, will create new one on first message');
      }
    };

    loadSessions();
  }, [isOpen, sessionId]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue;
    const now = new Date();
    setInputValue('');
    setMessages(prev => [...prev, { 
      id: Date.now() + '-user', 
      role: 'user', 
      content: userMessage,
      timestamp: now
    }]);

    try {
      setLoading(true);
      
      // Check if user has token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setMessages(prev => [...prev, { 
          id: Date.now() + '-error', 
          role: 'assistant', 
          content: 'Please log in first to use chat.',
          timestamp: new Date()
        }]);
        return;
      }

      // Create session if doesn't exist
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        try {
          const session = await createChatSession('Chat Session');
          currentSessionId = session.session_id;
          setSessionId(currentSessionId);
          if (typeof window !== 'undefined') {
            localStorage.setItem('currentChatSessionId', currentSessionId);
          }
        } catch (err) {
          setMessages(prev => [...prev, { 
            id: Date.now() + '-error', 
            role: 'assistant', 
            content: 'Failed to create chat session. Please try again.',
            timestamp: new Date()
          }]);
          return;
        }
      }

      const result = await sendChatMessage(currentSessionId, userMessage);
      setMessages(prev => [...prev, { 
        id: Date.now() + '-assistant', 
        role: 'assistant', 
        content: result.response,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, { 
        id: Date.now() + '-error', 
        role: 'assistant', 
        content: `Error: ${err?.message || 'Something went wrong'}.`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Widget Panel */}
      <div 
        className={`mb-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10 pointer-events-none'
        }`}
      >
        <div className="w-[450px] md:w-[500px] h-[700px] max-h-[85vh] flex flex-col bg-[#030014]/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)] overflow-hidden relative">
          
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02] relative z-10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <span className="text-white text-lg">🤖</span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-[#030014] rounded-full"></div>
              </div>
              <div>
                <h3 className="font-bold text-white tracking-tight flex items-center gap-1.5">
                  AI Interview Coach
                  <span className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px]">✓</span>
                </h3>
                <p className="text-xs text-zinc-400">Always online to help you</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative z-10 scroll-smooth">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4 animate-fade-in-up">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl mb-4 border border-white/10 shadow-inner">
                  👋
                </div>
                <h4 className="text-white font-bold mb-2">Welcome!</h4>
                <p className="text-sm text-zinc-400">Ask me anything about interview preparation, resuming building, or career advice.</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-6">
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  const showAvatar = !isUser && (i === 0 || messages[i-1].role === 'user');
                  
                  return (
                    <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade-in-up`}>
                      <div className="flex items-end gap-2 max-w-[85%]">
                        {!isUser && (
                          <div className={`w-6 h-6 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm ${showAvatar ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-[10px] text-white">🤖</span>
                          </div>
                        )}
                        <div className={`relative px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                          isUser 
                            ? 'bg-linear-to-br from-cyan-600 to-blue-600 text-white rounded-br-sm shadow-md' 
                            : 'bg-white/10 text-zinc-200 border border-white/5 rounded-bl-sm backdrop-blur-sm'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] text-zinc-500 mt-1.5 px-8 ${isUser ? 'text-right' : 'text-left'}`}>
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>
                  );
                })}
                
                {loading && (
                  <div className="flex items-start gap-2 max-w-[85%] animate-fade-in-up">
                    <div className="w-6 h-6 rounded-full bg-linear-to-tr from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[10px] text-white">🤖</span>
                    </div>
                    <div className="px-5 py-4 rounded-2xl bg-white/10 border border-white/5 rounded-bl-sm backdrop-blur-sm flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5 relative z-10">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-full pl-5 pr-12 py-3.5 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all placeholder-zinc-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="absolute right-1.5 w-9 h-9 flex items-center justify-center bg-cyan-500 hover:bg-cyan-400 text-white rounded-full transition-all disabled:opacity-50 disabled:scale-95 disabled:hover:bg-cyan-500"
              >
                <svg className="w-4 h-4 translate-x-px translate-y-px" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
            <div className="text-center mt-2">
              <span className="text-[9px] text-zinc-600 font-medium uppercase tracking-wider">AI responses may be inaccurate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all duration-300 z-50 ${
          isOpen ? 'bg-white/10 rotate-90 scale-90 shadow-none' : 'bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 hover:scale-105'
        }`}
        title={isOpen ? "Close Chat" : "Chat with AI Helper"}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg className="w-7 h-7 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <div className={`absolute inset-0 rounded-full border-2 border-cyan-400 opacity-0 group-hover:animate-ping ${isHovered ? 'opacity-100' : ''}`}></div>
          </>
        )}
      </button>
      
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
