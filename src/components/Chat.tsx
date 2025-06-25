import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface ChatProps {
  apiEndpoint?: string;
  apiKey?: string;
}

const Chat: React.FC<ChatProps> = ({ 
  apiEndpoint = process.env.REACT_APP_AI_API_ENDPOINT || 'https://cmtwciuguyzevyngv6umqg4m.agents.do-ai.run/api/v1/chat/completions',
  apiKey = process.env.REACT_APP_AI_API_KEY || ''
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const [showWelcome, setShowWelcome] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check for dark mode preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark-mode');
  };

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
        setShowWelcome(parsedMessages.length <= 1);
      } catch (error) {
        console.error('Error loading chat history:', error);
        setMessages([{
          id: '1',
          text: 'Xin chào! Tôi là AI Assistant. Bạn có thể hỏi tôi bất cứ điều gì!',
          sender: 'ai',
          timestamp: new Date()
        }]);
        setShowWelcome(true);
      }
    } else {
      setMessages([{
        id: '1',
        text: 'Xin chào! Tôi là AI Assistant. Bạn có thể hỏi tôi bất cứ điều gì!',
        sender: 'ai',
        timestamp: new Date()
      }]);
      setShowWelcome(true);
    }
  }, []);

  // Save messages to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('chat-messages', JSON.stringify(messages));
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testConnection = async () => {
    setConnectionStatus('connecting');
    setIsLoading(true);
    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: 'ping'
            }
          ],
          stream: false,
          include_functions_info: false,
          include_retrieval_info: false,
          include_guardrails_info: false
        })
      });

      if (response.ok) {
        setConnectionStatus('connected');
        addMessage('✅ Kết nối thành công với AI Agent!', 'ai');
      } else {
        setConnectionStatus('error');
        addMessage('❌ Không thể kết nối với AI Agent. Vui lòng kiểm tra cấu hình.', 'ai');
      }
    } catch (error) {
      setConnectionStatus('error');
      addMessage('❌ Lỗi kết nối: ' + (error as Error).message, 'ai');
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
    setShowWelcome(false);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userMessage
            }
          ],
          stream: false,
          include_functions_info: false,
          include_retrieval_info: false,
          include_guardrails_info: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiResponse = data.choices?.[0]?.message?.content || data.response || data.message || 'Tôi không hiểu câu hỏi của bạn.';
        addMessage(aiResponse, 'ai');
      } else {
        const errorData = await response.json().catch(() => ({}));
        addMessage(`❌ Lỗi: ${errorData.message || 'Không thể gửi tin nhắn'}`, 'ai');
      }
    } catch (error) {
      addMessage(`❌ Lỗi kết nối: ${(error as Error).message}`, 'ai');
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    const confirmClear = window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử chat?');
    if (confirmClear) {
      setMessages([{
        id: '1',
        text: 'Xin chào! Tôi là AI Assistant. Bạn có thể hỏi tôi bất cứ điều gì!',
        sender: 'ai',
        timestamp: new Date()
      }]);
      setShowWelcome(true);
      localStorage.removeItem('chat-messages');
    }
  };

  const exportChat = () => {
    const chatData = {
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp.toISOString()
      }))
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢 Đã kết nối';
      case 'connecting':
        return '🟡 Đang kết nối...';
      case 'error':
        return '🔴 Lỗi kết nối';
      default:
        return '⚪ Chưa kết nối';
    }
  };

  const quickQuestions = [
    'Bạn có thể giúp gì cho tôi?',
    'Giải thích về AI',
    'Viết code JavaScript',
    'Dịch sang tiếng Anh'
  ];

  const handleQuickQuestion = (question: string) => {
    setInputText(question);
    inputRef.current?.focus();
  };

  return (
    <div className={`chat-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="chat-header">
        <h2>AI Chat Assistant</h2>
        <div className="chat-controls">
          <button 
            className={`connection-btn ${connectionStatus}`}
            onClick={testConnection}
            disabled={isLoading}
          >
            {getConnectionStatusText()}
          </button>
          <button className="theme-btn" onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <button className="export-btn" onClick={exportChat}>
            📥 Xuất chat
          </button>
          <button className="clear-btn" onClick={clearChat}>
            🗑️ Xóa chat
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {showWelcome && messages.length <= 1 && (
          <div className="welcome-screen">
            <div className="welcome-content">
              <div className="welcome-logo">
                <div className="logo-circle">
                  <span className="logo-icon">✨</span>
                </div>
              </div>
              <h3>Chào mừng đến với AI Assistant!</h3>
              <p>Tôi có thể giúp bạn với nhiều vấn đề khác nhau. Hãy thử hỏi tôi một câu hỏi!</p>
              
              <div className="quick-questions">
                <h4>Gợi ý:</h4>
                <div className="question-grid">
                  {quickQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="quick-question-btn"
                      onClick={() => handleQuickQuestion(question)}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.sender === 'user' ? 'user-message' : 'ai-message'}`}
          >
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">
                {message.timestamp.toLocaleTimeString('vi-VN')}
              </div>
            </div>
            <div className="message-avatar">
              {message.sender === 'user' ? '👤' : '🤖'}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message ai-message">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div className="message-avatar">🤖</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <div className="input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn của bạn..."
            disabled={isLoading}
            rows={1}
          />
          <button 
            className="send-btn"
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? '⏳' : '📤'}
          </button>
        </div>
        
        <div className="input-hint">
          Nhấn Enter để gửi, Shift+Enter để xuống dòng • {messages.length - 1} tin nhắn
        </div>
      </div>
    </div>
  );
};

export default Chat; 