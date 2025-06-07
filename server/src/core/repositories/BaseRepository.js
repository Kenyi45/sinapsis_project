const IRepository = require('../interfaces/IRepository');
const DatabaseConnection = require('../database/DatabaseConnection');

/**
 * Base Repository Implementation
 * Implements Repository Pattern and Single Responsibility Principle
 */
class BaseRepository extends IRepository {
  constructor(tableName) {
    super();
    if (!tableName) {
      throw new Error('Table name is required');
    }
    this.tableName = tableName;
    this.db = new DatabaseConnection();
  }

  async findAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    
    let query = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    // Apply filters
    const whereConditions = this._buildWhereConditions(filters, params);
    if (whereConditions) {
      query += ` WHERE ${whereConditions}`;
    }
    
    query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
    
    return await this.db.executeQuery(query, params);
  }

  async findById(id) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const results = await this.db.executeQuery(query, [id]);
    return results[0] || null;
  }

  async create(data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map(() => '?').join(', ');
    
    const query = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES (${placeholders})`;
    const result = await this.db.executeQuery(query, values);
    
    return {
      insertId: result.insertId,
      affectedRows: result.affectedRows
    };
  }

  async update(id, data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    const query = `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`;
    const result = await this.db.executeQuery(query, [...values, id]);
    
    return {
      affectedRows: result.affectedRows,
      changedRows: result.changedRows
    };
  }

  async delete(id) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.db.executeQuery(query, [id]);
    
    return {
      affectedRows: result.affectedRows
    };
  }

  async count(filters = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const params = [];
    
    const whereConditions = this._buildWhereConditions(filters, params);
    if (whereConditions) {
      query += ` WHERE ${whereConditions}`;
    }
    
    const result = await this.db.executeQuery(query, params);
    return result[0].total;
  }

  /**
   * Helper method to build WHERE conditions
   * @private
   */
  _buildWhereConditions(filters, params) {
    const conditions = [];
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        conditions.push(`${key} = ?`);
        params.push(value);
      }
    });
    
    return conditions.length > 0 ? conditions.join(' AND ') : '';
  }

  /**
   * Execute custom query
   */
  async executeCustomQuery(query, params = []) {
    return await this.db.executeQuery(query, params);
  }
}

module.exports = BaseRepository; 