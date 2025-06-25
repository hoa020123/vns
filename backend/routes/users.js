const express = require('express');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const router = express.Router();

// Lấy danh sách user (chỉ admin)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, role, created_at FROM users ORDER BY id');
    res.json({ users: result.rows });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

// Xóa user (chỉ admin, không cho xóa chính mình)
router.delete('/:username', authenticateToken, requireAdmin, async (req, res) => {
  const { username } = req.params;
  if (username === req.user.username) {
    return res.status(400).json({ message: 'Không thể tự xóa chính mình' });
  }
  try {
    await db.query('DELETE FROM users WHERE username = $1', [username]);
    res.json({ message: 'Đã xóa user ' + username });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
});

module.exports = router; 