import React, { useState, useRef, useEffect } from 'react';
import './Chat.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const ChatDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là AI Assistant Demo. Bạn có thể test giao diện chat ở đây!',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const testConnection = async () => {
    setConnectionStatus('connecting');
    setIsLoading(true);
    
    // Simulate connection test
    setTimeout(() => {
      setConnectionStatus('connected');
      setIsLoading(false);
      addMessage('✅ Demo: Kết nối thành công! (Đây chỉ là demo)', 'ai');
    }, 2000);
  };

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = inputText.trim();
    setInputText('');
    addMessage(userMessage, 'user');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Đây là phản hồi demo từ AI Assistant! 🤖',
        'Tôi hiểu câu hỏi của bạn. Đây chỉ là demo thôi nhé!',
        'Cảm ơn bạn đã test giao diện chat!',
        'Demo mode: Tôi đang mô phỏng phản hồi từ AI Agent.',
        'Giao diện chat hoạt động tốt! Bạn có thể cấu hình kết nối thực sau.',
        'Đây là tin nhắn demo để test hiển thị tin nhắn dài. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addMessage(randomResponse, 'ai');
      setIsLoading(false);
    }, 1500);
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
        text: 'Xin chào! Tôi là AI Assistant Demo. Bạn có thể test giao diện chat ở đây!',
        sender: 'ai',
        timestamp: new Date()
      }]);
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
    a.download = `chat-demo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case 'connected':
        return '🟢 Demo Connected';
      case 'connecting':
        return '🟡 Đang kết nối...';
      case 'error':
        return '🔴 Lỗi kết nối';
      default:
        return '⚪ Demo Mode';
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>🤖 AI Chat Demo</h2>
        <div className="chat-controls">
          <button 
            className={`connection-btn ${connectionStatus}`}
            onClick={testConnection}
            disabled={isLoading}
          >
            {getConnectionStatusText()}
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
        
        {isLoading && (
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
            className="chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn để test demo..."
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
          Demo Mode • Nhấn Enter để gửi, Shift+Enter để xuống dòng • {messages.length - 1} tin nhắn
        </div>
      </div>

      <div className="chat-config">
        <details>
          <summary>ℹ️ Thông tin Demo</summary>
          <div className="config-content">
            <div className="config-item">
              <label>Chế độ:</label>
              <input 
                type="text" 
                value="Demo Mode - Không cần kết nối thực"
                disabled
              />
            </div>
            <div className="config-item">
              <label>Mô tả:</label>
              <input 
                type="text" 
                value="Test giao diện chat mà không cần AI Agent thực"
                disabled
              />
            </div>
            <p className="config-note">
              💡 Đây là chế độ demo để test giao diện chat.<br/>
              Để sử dụng với AI Agent thực, hãy chuyển sang tab "🤖 AI Chat" và cấu hình API.
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default ChatDemo; 