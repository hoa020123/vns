const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '12h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Đăng ký user mới (chỉ admin)
router.post('/register', authenticateToken, requireAdmin, async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, role || 'user']
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      res.status(400).json({ message: 'Tên đăng nhập đã tồn tại' });
    } else {
      res.status(500).json({ message: 'Lỗi server', error: err.message });
    }
  }
});

// Đổi mật khẩu (user tự đổi hoặc admin đổi cho user khác)
router.post('/change-password', authenticateToken, async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;
  try {
    // Nếu là admin, cho phép đổi mật khẩu cho user khác
    if (req.user.role === 'admin' && username && username !== req.user.username) {
      const hash = await bcrypt.hash(newPassword, 10);
      await db.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, username]);
      return res.json({ message: 'Đã đổi mật khẩu cho user ' + username });
    }
    // User tự đổi mật khẩu
    const result = await db.query('SELECT * FROM users WHERE username = $1', [req.user.username]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: 'Không tìm thấy user' });
    const match = await bcrypt.compare(oldPassword, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
    const hash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password_hash = $1 WHERE username = $2', [hash, req.user.username]);
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router;
