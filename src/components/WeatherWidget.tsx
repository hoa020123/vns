import React, { useState, useEffect } from 'react';
import './WeatherWidget.css';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 25,
    condition: 'Nắng đẹp',
    humidity: 65,
    windSpeed: 12
  });
  const [loading, setLoading] = useState(false);

  // Simulate weather data update
  const updateWeather = () => {
    setLoading(true);
    setTimeout(() => {
      const newWeather: WeatherData = {
        temperature: Math.floor(Math.random() * 35) + 15,
        condition: ['Nắng đẹp', 'Mây', 'Mưa nhẹ', 'Nắng nóng'][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5
      };
      setWeather(newWeather);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const interval = setInterval(updateWeather, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'Nắng đẹp': return '☀️';
      case 'Mây': return '☁️';
      case 'Mưa nhẹ': return '🌧️';
      case 'Nắng nóng': return '🔥';
      default: return '🌤️';
    }
  };

  return (
    <div className="weather-container">
      <h2>🌤️ Thời tiết</h2>
      
      <div className="weather-card">
        <div className="weather-main">
          <div className="weather-icon">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="weather-info">
            <div className="temperature">{weather.temperature}°C</div>
            <div className="condition">{weather.condition}</div>
          </div>
        </div>
        
        <div className="weather-details">
          <div className="detail-item">
            <span className="detail-label">💧 Độ ẩm</span>
            <span className="detail-value">{weather.humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">💨 Gió</span>
            <span className="detail-value">{weather.windSpeed} km/h</span>
          </div>
        </div>
        
        <button 
          onClick={updateWeather} 
          className={`btn btn-weather ${loading ? 'loading' : ''}`}
          disabled={loading}
        >
          {loading ? '🔄 Cập nhật...' : '🔄 Cập nhật'}
        </button>
      </div>
    </div>
  );
};

export default WeatherWidget; 