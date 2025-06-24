import React, { useState, useEffect } from 'react';
import './PasswordGenerator.css';

interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [options, setOptions] = useState<PasswordOptions>({
    length: 12,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSymbols: false,
    excludeSimilar: false,
    excludeAmbiguous: false
  });
  const [strength, setStrength] = useState(0);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = '';
    
    if (options.includeUppercase) chars += uppercase;
    if (options.includeLowercase) chars += lowercase;
    if (options.includeNumbers) chars += numbers;
    if (options.includeSymbols) chars += symbols;
    
    if (options.excludeSimilar) {
      chars = chars.replace(/[il1Lo0O]/g, '');
    }
    
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[{}[\]()/\\'"`~,;:.<>]/g, '');
    }
    
    if (chars === '') {
      setPassword('');
      return;
    }
    
    let result = '';
    for (let i = 0; i < options.length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setPassword(result);
  };

  const calculateStrength = (pass: string) => {
    let score = 0;
    
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    if (pass.length >= 16) score += 1;
    
    if (/[a-z]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;
    
    return Math.min(score, 5);
  };

  const copyToClipboard = async () => {
    if (password) {
      try {
        await navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy password:', err);
      }
    }
  };

  useEffect(() => {
    generatePassword();
  }, [options]);

  useEffect(() => {
    setStrength(calculateStrength(password));
  }, [password]);

  const getStrengthText = (strength: number) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: 'Rất yếu', color: '#ef4444' };
      case 2:
        return { text: 'Yếu', color: '#f97316' };
      case 3:
        return { text: 'Trung bình', color: '#eab308' };
      case 4:
        return { text: 'Mạnh', color: '#22c55e' };
      case 5:
        return { text: 'Rất mạnh', color: '#16a34a' };
      default:
        return { text: 'Rất yếu', color: '#ef4444' };
    }
  };

  const strengthInfo = getStrengthText(strength);

  return (
    <div className="password-generator">
      <div className="generator-header">
        <h2>🔐 Tạo mật khẩu</h2>
        <p>Tạo mật khẩu mạnh và an toàn</p>
      </div>

      <div className="password-display">
        <div className="password-field">
          <input
            type="text"
            value={password}
            readOnly
            placeholder="Mật khẩu sẽ xuất hiện ở đây..."
            className="password-input"
          />
          <button 
            onClick={copyToClipboard}
            className={`copy-btn ${copied ? 'copied' : ''}`}
            disabled={!password}
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
        
        {password && (
          <div className="strength-meter">
            <div className="strength-label">
              <span>Độ mạnh:</span>
              <span style={{ color: strengthInfo.color }}>{strengthInfo.text}</span>
            </div>
            <div className="strength-bars">
              {[1, 2, 3, 4, 5].map((level) => (
                <div
                  key={level}
                  className={`strength-bar ${level <= strength ? 'filled' : ''}`}
                  style={{ 
                    backgroundColor: level <= strength ? strengthInfo.color : '#e5e7eb' 
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="options-section">
        <h3>Tùy chọn mật khẩu</h3>
        
        <div className="option-group">
          <label className="option-label">
            <span>Độ dài: {options.length}</span>
            <input
              type="range"
              min="4"
              max="50"
              value={options.length}
              onChange={(e) => setOptions({...options, length: parseInt(e.target.value)})}
              className="length-slider"
            />
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.includeUppercase}
              onChange={(e) => setOptions({...options, includeUppercase: e.target.checked})}
            />
            <span>Chữ hoa (A-Z)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.includeLowercase}
              onChange={(e) => setOptions({...options, includeLowercase: e.target.checked})}
            />
            <span>Chữ thường (a-z)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.includeNumbers}
              onChange={(e) => setOptions({...options, includeNumbers: e.target.checked})}
            />
            <span>Số (0-9)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.includeSymbols}
              onChange={(e) => setOptions({...options, includeSymbols: e.target.checked})}
            />
            <span>Ký tự đặc biệt (!@#$%^&*)</span>
          </label>
        </div>

        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.excludeSimilar}
              onChange={(e) => setOptions({...options, excludeSimilar: e.target.checked})}
            />
            <span>Loại trừ ký tự tương tự (il1Lo0O)</span>
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={options.excludeAmbiguous}
              onChange={(e) => setOptions({...options, excludeAmbiguous: e.target.checked})}
            />
            <span>Loại trừ ký tự mơ hồ (&#123;&#91;&#40;&#41;&#93;&#125;)</span>
          </label>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={generatePassword} className="generate-btn">
          🔄 Tạo mật khẩu mới
        </button>
      </div>

      <div className="tips-section">
        <h3>💡 Mẹo tạo mật khẩu mạnh</h3>
        <ul>
          <li>Sử dụng ít nhất 12 ký tự</li>
          <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt</li>
          <li>Tránh sử dụng thông tin cá nhân</li>
          <li>Không sử dụng cùng một mật khẩu cho nhiều tài khoản</li>
          <li>Thay đổi mật khẩu định kỳ</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordGenerator; 