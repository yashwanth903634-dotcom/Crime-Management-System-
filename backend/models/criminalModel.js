const db = require('../config/db');

const CriminalModel = {
  // Get all criminals
  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM criminals ORDER BY id DESC');
    return rows;
  },

  // Get a criminal by ID
  getById: async (id) => {
    const [rows] = await db.query('SELECT * FROM criminals WHERE id = ?', [id]);
    return rows[0];
  },

  // Add a new criminal
  create: async (data) => {
    const {
      case_id, criminal_id, criminal_name, nickname, crime_type,
      father_name, gender, arrest_date, crime_date, address, age,
      occupation, birth_mark, police_station, status, criminal_photo
    } = data;
    
    const [result] = await db.query(
      `INSERT INTO criminals (
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date, crime_date, address, age,
        occupation, birth_mark, police_station, status, criminal_photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        case_id, criminal_id, criminal_name, nickname, crime_type,
        father_name, gender, arrest_date || null, crime_date || null, address, age,
        occupation, birth_mark, police_station, status || 'Active', criminal_photo
      ]
    );
    return result.insertId;
  },

  // Update a criminal
  update: async (id, data) => {
    const {
      case_id, criminal_id, criminal_name, nickname, crime_type,
      father_name, gender, arrest_date, crime_date, address, age,
      occupation, birth_mark, police_station, status, criminal_photo
    } = data;
    
    let query = `UPDATE criminals SET 
      case_id=?, criminal_id=?, criminal_name=?, nickname=?, crime_type=?,
      father_name=?, gender=?, arrest_date=?, crime_date=?, address=?, age=?,
      occupation=?, birth_mark=?, police_station=?, status=?`;
      
    let params = [
      case_id, criminal_id, criminal_name, nickname, crime_type,
      father_name, gender, arrest_date || null, crime_date || null, address, age,
      occupation, birth_mark, police_station, status
    ];

    if (criminal_photo) {
      query += `, criminal_photo=?`;
      params.push(criminal_photo);
    }
    
    query += ` WHERE id=?`;
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows;
  },

  // Delete a criminal
  delete: async (id) => {
    const [result] = await db.query('DELETE FROM criminals WHERE id = ?', [id]);
    return result.affectedRows;
  },

  // Search criminals
  search: async (searchTerm) => {
    const likeTerm = `%${searchTerm}%`;
    const [rows] = await db.query(
      `SELECT * FROM criminals WHERE criminal_name LIKE ? OR nickname LIKE ? OR criminal_id LIKE ? OR case_id LIKE ? OR crime_type LIKE ?`,
      [likeTerm, likeTerm, likeTerm, likeTerm, likeTerm]
    );
    return rows;
  },

  // Get dashboard statistics - all calculated from real data
  getStats: async () => {
    // Total criminals
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM criminals');
    
    // Active cases
    const [[{ active_cases }]] = await db.query("SELECT COUNT(*) as active_cases FROM criminals WHERE status = 'Active'");
    
    // Wanted criminals
    const [[{ wanted }]] = await db.query("SELECT COUNT(*) as wanted FROM criminals WHERE status = 'Wanted'");
    
    // Captured
    const [[{ captured }]] = await db.query("SELECT COUNT(*) as captured FROM criminals WHERE status = 'Captured'");
    
    // Deceased
    const [[{ deceased }]] = await db.query("SELECT COUNT(*) as deceased FROM criminals WHERE status = 'Deceased'");

    // Crime type distribution (for charts)
    const [crimeTypes] = await db.query(
      `SELECT crime_type, COUNT(*) as count FROM criminals WHERE crime_type IS NOT NULL AND crime_type != '' GROUP BY crime_type ORDER BY count DESC`
    );

    // Status distribution (for charts)
    const [statusDist] = await db.query(
      `SELECT status, COUNT(*) as count FROM criminals WHERE status IS NOT NULL AND status != '' GROUP BY status ORDER BY count DESC`
    );

    // Monthly trends (last 12 months)
    const [monthlyTrends] = await db.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count 
       FROM criminals 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH) 
       GROUP BY month 
       ORDER BY month ASC`
    );

    // Police station distribution (for hotspot data)
    const [stationDist] = await db.query(
      `SELECT police_station, COUNT(*) as count FROM criminals WHERE police_station IS NOT NULL AND police_station != '' GROUP BY police_station ORDER BY count DESC`
    );

    // Gender distribution
    const [genderDist] = await db.query(
      `SELECT gender, COUNT(*) as count FROM criminals WHERE gender IS NOT NULL AND gender != '' GROUP BY gender ORDER BY count DESC`
    );

    // Age distribution
    const [ageDist] = await db.query(
      `SELECT 
        CASE 
          WHEN age < 18 THEN 'Under 18'
          WHEN age BETWEEN 18 AND 25 THEN '18-25'
          WHEN age BETWEEN 26 AND 35 THEN '26-35'
          WHEN age BETWEEN 36 AND 45 THEN '36-45'
          WHEN age BETWEEN 46 AND 60 THEN '46-60'
          WHEN age > 60 THEN 'Over 60'
          ELSE 'Unknown'
        END as age_group, 
        COUNT(*) as count 
       FROM criminals 
       GROUP BY age_group 
       ORDER BY count DESC`
    );

    // Recent 5 records
    const [recentRecords] = await db.query(
      'SELECT id, case_id, criminal_name, crime_type, status, created_at FROM criminals ORDER BY id DESC LIMIT 5'
    );

    return {
      total,
      active_cases,
      wanted,
      captured,
      deceased,
      crimeTypes,
      statusDist,
      monthlyTrends,
      stationDist,
      genderDist,
      ageDist,
      recentRecords
    };
  }
};

module.exports = CriminalModel;
