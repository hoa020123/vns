import React, { useState, useEffect, useRef } from 'react';
import './PomodoroTimer.css';

interface TimerState {
  minutes: number;
  seconds: number;
  isRunning: boolean;
  isBreak: boolean;
}

const PomodoroTimer: React.FC = () => {
  const [timer, setTimer] = useState<TimerState>({
    minutes: 25,
    seconds: 0,
    isRunning: false,
    isBreak: false
  });
  const [cycles, setCycles] = useState(0);
  const [settings, setSettings] = useState({
    workTime: 25,
    breakTime: 5,
    longBreakTime: 15,
    longBreakInterval: 4
  });
  const [showSettings, setShowSettings] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (timer.isRunning) {
      intervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev.seconds > 0) {
            return { ...prev, seconds: prev.seconds - 1 };
          } else if (prev.minutes > 0) {
            return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
          } else {
            // Timer finished
            playNotification();
            if (prev.isBreak) {
              // Break finished, start work
              setCycles(prev => prev + 1);
              return {
                minutes: settings.workTime,
                seconds: 0,
                isRunning: false,
                isBreak: false
              };
            } else {
              // Work finished, start break
              const shouldTakeLongBreak = (cycles + 1) % settings.longBreakInterval === 0;
              return {
                minutes: shouldTakeLongBreak ? settings.longBreakTime : settings.breakTime,
                seconds: 0,
                isRunning: false,
                isBreak: true
              };
            }
          }
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timer.isRunning, timer.minutes, timer.seconds, timer.isBreak, cycles, settings]);

  const playNotification = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro Timer', {
        body: timer.isBreak ? 'Thời gian nghỉ đã kết thúc!' : 'Thời gian làm việc đã kết thúc!',
        icon: '/favicon.ico'
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const startTimer = () => {
    requestNotificationPermission();
    setTimer(prev => ({ ...prev, isRunning: true }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const resetTimer = () => {
    setTimer({
      minutes: timer.isBreak ? settings.breakTime : settings.workTime,
      seconds: 0,
      isRunning: false,
      isBreak: timer.isBreak
    });
  };

  const skipTimer = () => {
    if (timer.isBreak) {
      setCycles(prev => prev + 1);
      setTimer({
        minutes: settings.workTime,
        seconds: 0,
        isRunning: false,
        isBreak: false
      });
    } else {
      const shouldTakeLongBreak = (cycles + 1) % settings.longBreakInterval === 0;
      setTimer({
        minutes: shouldTakeLongBreak ? settings.longBreakTime : settings.breakTime,
        seconds: 0,
        isRunning: false,
        isBreak: true
      });
    }
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalSeconds = timer.isBreak 
      ? (settings.breakTime * 60) 
      : (settings.workTime * 60);
    const remainingSeconds = timer.minutes * 60 + timer.seconds;
    return ((totalSeconds - remainingSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="pomodoro-container">
      <h2>🍅 Pomodoro Timer</h2>
      
      <div className="pomodoro-card">
        <div className="timer-display">
          <div className="timer-circle">
            <svg className="progress-ring" width="200" height="200">
              <circle
                className="progress-ring-circle-bg"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="8"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
              />
              <circle
                className="progress-ring-circle"
                stroke={timer.isBreak ? '#4CAF50' : '#FF5722'}
                strokeWidth="8"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgress() / 100)}`}
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="timer-text">
              <div className="timer-time">{formatTime(timer.minutes, timer.seconds)}</div>
              <div className="timer-label">
                {timer.isBreak ? 'Nghỉ ngơi' : 'Làm việc'}
              </div>
            </div>
          </div>
        </div>

        <div className="timer-controls">
          {!timer.isRunning ? (
            <button onClick={startTimer} className="btn btn-primary">
              ▶️ Bắt đầu
            </button>
          ) : (
            <button onClick={pauseTimer} className="btn btn-secondary">
              ⏸️ Tạm dừng
            </button>
          )}
          
          <button onClick={resetTimer} className="btn btn-reset">
            🔄 Reset
          </button>
          
          <button onClick={skipTimer} className="btn btn-skip">
            ⏭️ Bỏ qua
          </button>
        </div>

        <div className="timer-stats">
          <div className="stat-item">
            <span className="stat-label">Chu kỳ</span>
            <span className="stat-value">{cycles}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian làm việc</span>
            <span className="stat-value">{settings.workTime} phút</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Thời gian nghỉ</span>
            <span className="stat-value">{settings.breakTime} phút</span>
          </div>
        </div>

        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="btn btn-settings"
        >
          ⚙️ Cài đặt
        </button>

        {showSettings && (
          <div className="settings-panel">
            <h3>Cài đặt Timer</h3>
            <div className="setting-group">
              <label>Thời gian làm việc (phút):</label>
              <input
                type="number"
                value={settings.workTime}
                onChange={(e) => setSettings(prev => ({ ...prev, workTime: parseInt(e.target.value) || 25 }))}
                min="1"
                max="60"
              />
            </div>
            <div className="setting-group">
              <label>Thời gian nghỉ ngắn (phút):</label>
              <input
                type="number"
                value={settings.breakTime}
                onChange={(e) => setSettings(prev => ({ ...prev, breakTime: parseInt(e.target.value) || 5 }))}
                min="1"
                max="30"
              />
            </div>
            <div className="setting-group">
              <label>Thời gian nghỉ dài (phút):</label>
              <input
                type="number"
                value={settings.longBreakTime}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakTime: parseInt(e.target.value) || 15 }))}
                min="1"
                max="60"
              />
            </div>
            <div className="setting-group">
              <label>Số chu kỳ trước khi nghỉ dài:</label>
              <input
                type="number"
                value={settings.longBreakInterval}
                onChange={(e) => setSettings(prev => ({ ...prev, longBreakInterval: parseInt(e.target.value) || 4 }))}
                min="1"
                max="10"
              />
            </div>
          </div>
        )}
      </div>

      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT" />
    </div>
  );
};

export default PomodoroTimer; 