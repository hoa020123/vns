import React, { useState, useEffect } from 'react';
import './Notes.css';

interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('vns-notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('vns-notes', JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: 'Ghi chú mới',
      content: 'Bắt đầu viết ghi chú của bạn...',
      color: colors[Math.floor(Math.random() * colors.length)],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    setIsEditing(true);
  };

  const updateNote = (id: number, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, ...updates, updatedAt: new Date() }
        : note
    ));
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
      setIsEditing(false);
    }
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="notes-container">
      <h2>📝 Ghi chú</h2>
      
      <div className="notes-header">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm ghi chú..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <button onClick={createNote} className="btn btn-primary">
          ✨ Tạo ghi chú mới
        </button>
      </div>

      <div className="notes-layout">
        <div className="notes-sidebar">
          <h3>Danh sách ghi chú ({filteredNotes.length})</h3>
          <div className="notes-list">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                className={`note-item ${selectedNote?.id === note.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedNote(note);
                  setIsEditing(false);
                }}
                style={{ borderLeftColor: note.color }}
              >
                <div className="note-title">{note.title}</div>
                <div className="note-preview">
                  {note.content.substring(0, 50)}...
                </div>
                <div className="note-date">
                  {formatDate(note.updatedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="notes-content">
          {selectedNote ? (
            <div className="note-editor">
              <div className="note-editor-header">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNote(selectedNote.id, { title: e.target.value })}
                  className="note-title-input"
                  disabled={!isEditing}
                />
                <div className="note-actions">
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn btn-secondary"
                  >
                    {isEditing ? '💾 Lưu' : '✏️ Chỉnh sửa'}
                  </button>
                  <button
                    onClick={() => deleteNote(selectedNote.id)}
                    className="btn btn-delete"
                  >
                    🗑️ Xóa
                  </button>
                </div>
              </div>
              
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNote(selectedNote.id, { content: e.target.value })}
                className="note-content-input"
                disabled={!isEditing}
                placeholder="Viết nội dung ghi chú..."
              />
              
              <div className="note-info">
                <span>Tạo lúc: {formatDate(selectedNote.createdAt)}</span>
                <span>Cập nhật: {formatDate(selectedNote.updatedAt)}</span>
              </div>
            </div>
          ) : (
            <div className="empty-notes">
              <h3>Chưa có ghi chú nào</h3>
              <p>Hãy tạo ghi chú đầu tiên của bạn!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes; 