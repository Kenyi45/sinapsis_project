const mysql = require('mysql2/promise');

/**
 * Database Connection Singleton
 * Implements Singleton Pattern and Dependency Inversion Principle
 */
class DatabaseConnection {
  constructor() {
    if (DatabaseConnection.instance) {
      return DatabaseConnection.instance;
    }

    this.pool = null;
    this.config = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'sinapsis_user',
      password: process.env.DB_PASSWORD || 'sinapsis_password',
      database: process.env.DB_NAME || 'sinapsis_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: '+00:00',
      typeCast: function (field, next) {
        if (field.type === 'VAR_STRING' || field.type === 'STRING') {
          return field.string();
        }
        return next();
      }
    };

    DatabaseConnection.instance = this;
  }

  async connect() {
    if (!this.pool) {
      this.pool = mysql.createPool(this.config);
    }
    return this.pool;
  }

  async executeQuery(query, params = []) {
    const pool = await this.connect();
    const connection = await pool.getConnection();
    
    try {
      // Set charset for this connection
      await connection.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
      
      // Execute the query
      const [results] = await connection.execute(query, params);
      return results;
    } finally {
      connection.release();
    }
  }

  async testConnection() {
    try {
      const pool = await this.connect();
      const connection = await pool.getConnection();
      
      // Set charset explicitly for this connection
      await connection.execute('SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci');
      await connection.execute('SET CHARACTER SET utf8mb4');
      await connection.execute('SET character_set_connection=utf8mb4');
      
      console.log('✅ Database connected successfully with UTF-8 support');
      connection.release();
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      return false;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

module.exports = DatabaseConnection; 