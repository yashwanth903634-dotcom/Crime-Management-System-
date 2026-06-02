const db = require('../config/db');

const UserModel = {
  // Find user by username
  findByUsername: async (username) => {
    const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND is_active = TRUE', [username]);
    return rows[0];
  },

  // Find user by ID
  findById: async (id) => {
    const [rows] = await db.query('SELECT id, username, full_name, role, badge_number, email, created_at FROM users WHERE id = ? AND is_active = TRUE', [id]);
    return rows[0];
  },

  // Create user
  create: async (data) => {
    const { username, password, full_name, role, badge_number, email } = data;
    const [result] = await db.query(
      `INSERT INTO users (username, password, full_name, role, badge_number, email) VALUES (?, ?, ?, ?, ?, ?)`,
      [username, password, full_name, role || 'police_officer', badge_number, email]
    );
    return result.insertId;
  },

  // Get all users (admin only)
  getAll: async () => {
    const [rows] = await db.query('SELECT id, username, full_name, role, badge_number, email, is_active, created_at FROM users ORDER BY id DESC');
    return rows;
  }
};

module.exports = UserModel;
