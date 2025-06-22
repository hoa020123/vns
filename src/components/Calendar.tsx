import React, { useState, useEffect } from 'react';
import './Calendar.css';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  color: string;
}

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    color: '#3b82f6'
  });

  const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDate(date));
    setShowEventForm(true);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      time: '',
      color: '#3b82f6'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingEvent) {
      // Update existing event
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...formData }
          : event
      ));
    } else {
      // Add new event
      const newEvent: Event = {
        id: Date.now().toString(),
        ...formData,
        date: selectedDate
      };
      setEvents([...events, newEvent]);
    }
    
    setShowEventForm(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      time: '',
      color: '#3b82f6'
    });
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setFormData({
      title: event.title,
      description: event.description,
      time: event.time,
      color: event.color
    });
    setShowEventForm(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>📅 Lịch & Sự kiện</h2>
        <div className="calendar-nav">
          <button className="nav-btn" onClick={prevMonth}>‹</button>
          <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
          <button className="nav-btn" onClick={nextMonth}>›</button>
        </div>
      </div>

      <div className="calendar-grid">
        <div className="calendar-days">
          {dayNames.map(day => (
            <div key={day} className="day-header">{day}</div>
          ))}
        </div>
        
        <div className="calendar-body">
          {days.map((day, index) => (
            <div
              key={index}
              className={`calendar-day ${!day ? 'empty' : ''} ${
                day && formatDate(day) === formatDate(new Date()) ? 'today' : ''
              }`}
              onClick={() => day && handleDateClick(day)}
            >
              {day && (
                <>
                  <span className="day-number">{day.getDate()}</span>
                  <div className="day-events">
                    {getEventsForDate(day).slice(0, 2).map(event => (
                      <div
                        key={event.id}
                        className="event-dot"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      />
                    ))}
                    {getEventsForDate(day).length > 2 && (
                      <span className="more-events">+{getEventsForDate(day).length - 2}</span>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-events">
          <h4>Sự kiện ngày {selectedDate}</h4>
          {getEventsForDate(new Date(selectedDate)).length === 0 ? (
            <p>Không có sự kiện nào</p>
          ) : (
            <div className="events-list">
              {getEventsForDate(new Date(selectedDate)).map(event => (
                <div key={event.id} className="event-item" style={{ borderLeftColor: event.color }}>
                  <div className="event-info">
                    <h5>{event.title}</h5>
                    <p>{event.description}</p>
                    <span className="event-time">{event.time}</span>
                  </div>
                  <div className="event-actions">
                    <button onClick={() => handleEditEvent(event)} className="edit-btn">✏️</button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showEventForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tiêu đề:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mô tả:</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Thời gian:</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Màu sắc:</label>
                <div className="color-picker">
                  {colors.map(color => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${formData.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>
              
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Cập nhật' : 'Thêm'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowEventForm(false);
                    setEditingEvent(null);
                  }}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar; 