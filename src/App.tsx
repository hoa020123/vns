import React, { useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';
import WeatherWidget from './components/WeatherWidget';
import Calculator from './components/Calculator';
import Notes from './components/Notes';
import PomodoroTimer from './components/PomodoroTimer';
import Calendar from './components/Calendar';
import PasswordGenerator from './components/PasswordGenerator';

function App() {
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState<'counter' | 'todo' | 'weather' | 'calculator' | 'notes' | 'pomodoro' | 'calendar' | 'password'>('counter');

  const renderContent = () => {
    switch (activeTab) {
      case 'todo':
        return <TodoList />;
      case 'weather':
        return <WeatherWidget />;
      case 'calculator':
        return <Calculator />;
      case 'notes':
        return <Notes />;
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'calendar':
        return <Calendar />;
      case 'password':
        return <PasswordGenerator />;
      default:
        return (
          <div className="card">
            <h2>Bộ đếm</h2>
            <p className="counter">{count}</p>
            <div className="button-group">
              <button 
                className="btn btn-primary"
                onClick={() => setCount(count + 1)}
              >
                Tăng
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setCount(count - 1)}
              >
                Giảm
              </button>
              <button 
                className="btn btn-reset"
                onClick={() => setCount(0)}
              >
                Reset
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1 className="title">Chào mừng đến với VNS Project</h1>
          <p className="subtitle">Dự án React với TypeScript</p>
          
          <div className="tab-navigation">
            <button 
              className={`tab-btn ${activeTab === 'counter' ? 'active' : ''}`}
              onClick={() => setActiveTab('counter')}
            >
              🔢 Bộ đếm
            </button>
            <button 
              className={`tab-btn ${activeTab === 'todo' ? 'active' : ''}`}
              onClick={() => setActiveTab('todo')}
            >
              📝 Todo List
            </button>
            <button 
              className={`tab-btn ${activeTab === 'weather' ? 'active' : ''}`}
              onClick={() => setActiveTab('weather')}
            >
              🌤️ Thời tiết
            </button>
            <button 
              className={`tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
              onClick={() => setActiveTab('calculator')}
            >
              🧮 Máy tính
            </button>
            <button 
              className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              📝 Ghi chú
            </button>
            <button 
              className={`tab-btn ${activeTab === 'pomodoro' ? 'active' : ''}`}
              onClick={() => setActiveTab('pomodoro')}
            >
              🍅 Pomodoro
            </button>
            <button 
              className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
              onClick={() => setActiveTab('calendar')}
            >
              📅 Lịch
            </button>
            <button 
              className={`tab-btn ${activeTab === 'password' ? 'active' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              🔐 Mật khẩu
            </button>
          </div>

          {renderContent()}

          <div className="features">
            <div className="feature">
              <h3>🚀 React 18</h3>
              <p>Phiên bản mới nhất với Concurrent Features</p>
            </div>
            <div className="feature">
              <h3>📝 TypeScript</h3>
              <p>Type safety và IntelliSense</p>
            </div>
            <div className="feature">
              <h3>🎨 CSS Modules</h3>
              <p>Styling hiện đại và responsive</p>
            </div>
            <div className="feature">
              <h3>⚡ Components</h3>
              <p>Modular và reusable components</p>
            </div>
            <div className="feature">
              <h3>🛠️ Tools</h3>
              <p>Todo, Calculator, Weather Widget, Calendar</p>
            </div>
            <div className="feature">
              <h3>🔐 Security</h3>
              <p>Password Generator với độ mạnh</p>
            </div>
            <div className="feature">
              <h3>💾 LocalStorage</h3>
              <p>Lưu trữ dữ liệu cục bộ</p>
            </div>
            <div className="feature">
              <h3>📱 Responsive</h3>
              <p>Tối ưu cho mobile và desktop</p>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App; 