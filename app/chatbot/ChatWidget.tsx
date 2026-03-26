'use client';

import { useState, useRef, useEffect } from 'react';
import { sendChatMessage, createChatSession, getChatSessions, getChatHistory } from '@/lib/chat/chatApi';
import styles from './chatWidget.module.css';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load user's sessions when chat opens
  useEffect(() => {
    const loadSessions = async () => {
      if (!isOpen) return;
      
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (!token) return;

        const sessions = await getChatSessions();
        
        if (sessions && sessions.length > 0) {
          // Get the most recent session (should be first)
          const latestSession = sessions[0];
          setSessionId(latestSession._id);
          
          // Load chat history for this session
          const history = await getChatHistory(latestSession._id);
          const loadedMessages: Message[] = history.map((msg, idx) => ({
            id: `${latestSession._id}-${idx}`,
            role: msg.role,
            content: msg.content,
            timestamp: new Date()
          }));
          setMessages(loadedMessages);
          console.log('Loaded session with', loadedMessages.length, 'messages');
        }
      } catch (err) {
        console.log('No previous sessions found, will create new one on first message');
      }
    };

    loadSessions();
  }, [isOpen]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
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
        console.log('Creating new chat session...');
        try {
          const session = await createChatSession('Chat Session');
          console.log('Session created:', session.session_id);
          currentSessionId = session.session_id;
          setSessionId(currentSessionId);
        } catch (err) {
          console.error('Failed to create session:', err);
          setMessages(prev => [...prev, { 
            id: Date.now() + '-error', 
            role: 'assistant', 
            content: 'Failed to create chat session. Please try again.',
            timestamp: new Date()
          }]);
          return;
        }
      }

      // Send message with valid session ID
      console.log('Sending message with session:', currentSessionId);
      const result = await sendChatMessage(currentSessionId, userMessage);
      console.log('Response:', result);
      setMessages(prev => [...prev, { 
        id: Date.now() + '-assistant', 
        role: 'assistant', 
        content: result.response,
        timestamp: new Date()
      }]);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, { 
        id: Date.now() + '-error', 
        role: 'assistant', 
        content: `Error: ${err?.message || 'Something went wrong'}. Check console for details.`,
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.chatButton}
        title="Chat with AI Helper"
      >
        💬
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidget}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <h3>Your AI Helper</h3>
              <span className={styles.verified}>✓</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={styles.closeBtn}
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className={styles.chatMessages}>
            {messages.length === 0 ? (
              <div className={styles.welcome}>
                <p>How can we help you today?</p>
              </div>
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={styles.messageGroup}>
                    <div className={`${styles.message} ${styles[msg.role === 'user' ? 'userMsg' : 'assistantMsg']}`}>
                      {msg.role === 'assistant' && (
                        <div className={styles.senderLabel}>Description about analytics.</div>
                      )}
                      <div className={styles.messageContent}>{msg.content}</div>
                      <div className={styles.timestamp}>
                        {formatDate(msg.timestamp)} {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className={styles.messageGroup}>
                    <div className={`${styles.message} ${styles.assistantMsg}`}>
                      <div className={styles.messageContent}>
                        <span className={styles.typing}>●●●</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className={styles.inputForm}>
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              placeholder="Ask me anything..."
              className={styles.input}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className={styles.sendBtn}
            >
              ↑
            </button>
          </form>
        </div>
      )}
    </>
  );
}
