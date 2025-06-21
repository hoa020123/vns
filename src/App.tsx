import React, { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <h1 className="title">Chào mừng đến với VNS Project</h1>
          <p className="subtitle">Dự án React với TypeScript</p>
          
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
          </div>
        </div>
      </header>
    </div>
  );
}

export default App; 