const db = require('../config/db');

const ActivityModel = {
  // Log an activity
  create: async (data) => {
    const { user_id, action, entity_type, entity_id, description } = data;
    const [result] = await db.query(
      `INSERT INTO activity_log (user_id, action, entity_type, entity_id, description) VALUES (?, ?, ?, ?, ?)`,
      [user_id || null, action, entity_type, entity_id || null, description]
    );
    return result.insertId;
  },

  // Get recent activities
  getRecent: async (limit = 20) => {
    const [rows] = await db.query(
      `SELECT a.*, u.full_name as user_name, u.role as user_role 
       FROM activity_log a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  // Get all activities (with pagination)
  getAll: async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    const [rows] = await db.query(
      `SELECT a.*, u.full_name as user_name, u.role as user_role 
       FROM activity_log a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows;
  }
};

module.exports = ActivityModel;
