import React, { useState } from 'react';
import './TodoList.css';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputValue.trim(),
        completed: false
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="todo-container">
      <h2>📝 Danh sách công việc</h2>
      
      <div className="todo-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Nhập công việc mới..."
          className="todo-input-field"
        />
        <button onClick={addTodo} className="btn btn-primary">
          Thêm
        </button>
      </div>

      <div className="todo-stats">
        <span>Tổng: {todos.length}</span>
        <span>Hoàn thành: {todos.filter(t => t.completed).length}</span>
        <span>Còn lại: {todos.filter(t => !t.completed).length}</span>
      </div>

      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="todo-checkbox"
            />
            <span className="todo-text">{todo.text}</span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="btn btn-delete"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="empty-state">Chưa có công việc nào. Hãy thêm công việc đầu tiên!</p>
      )}
    </div>
  );
};

export default TodoList; 