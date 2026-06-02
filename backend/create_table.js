const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
    try {
        // Connect to MySQL server without selecting a database
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '123456'
        });

        console.log("Connected to MySQL server.");

        // Create the database if it doesn't exist
        const dbName = process.env.DB_NAME || 'crime_db';
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        console.log(`Database '${dbName}' created or already exists.`);

        // Use the database
        await connection.query(`USE \`${dbName}\`;`);

        // Create the criminals table
        const criminalsQuery = `
        CREATE TABLE IF NOT EXISTS criminals (
            id INT AUTO_INCREMENT PRIMARY KEY,
            case_id VARCHAR(50),
            criminal_id VARCHAR(50),
            criminal_name VARCHAR(100),
            nickname VARCHAR(100),
            crime_type VARCHAR(100),
            father_name VARCHAR(100),
            gender VARCHAR(20),
            arrest_date DATE,
            crime_date DATE,
            address TEXT,
            age INT,
            occupation VARCHAR(100),
            birth_mark VARCHAR(100),
            police_station VARCHAR(100),
            status VARCHAR(50) DEFAULT 'Active',
            criminal_photo VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;
        await connection.query(criminalsQuery);
        console.log("Table 'criminals' created successfully!");

        // Create the users table for authentication
        const usersQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role ENUM('admin', 'police_officer') DEFAULT 'police_officer',
            badge_number VARCHAR(50),
            email VARCHAR(100),
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;
        await connection.query(usersQuery);
        console.log("Table 'users' created successfully!");

        // Create the activity_log table
        const activityQuery = `
        CREATE TABLE IF NOT EXISTS activity_log (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT,
            action VARCHAR(50) NOT NULL,
            entity_type VARCHAR(50) NOT NULL,
            entity_id INT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
        );`;
        await connection.query(activityQuery);
        console.log("Table 'activity_log' created successfully!");

        // Insert default admin user (password: admin123)
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await connection.query(
            `INSERT IGNORE INTO users (username, password, full_name, role, badge_number, email)
             VALUES (?, ?, ?, ?, ?, ?)`,
            ['admin', hashedPassword, 'System Administrator', 'admin', 'ADM-001', 'admin@novaenforce.com']
        );
        console.log("Default admin user created (username: admin, password: admin123)");
        
        await connection.end();
        process.exit(0);
    } catch (e) {
        console.error("Error setting up database:", e);
        process.exit(1);
    }
}

initializeDatabase();
