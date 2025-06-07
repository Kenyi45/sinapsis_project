const BaseRepository = require('../core/repositories/BaseRepository');

/**
 * User Repository
 * Implements Repository Pattern with specific user operations
 * Follows Single Responsibility Principle
 */
class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  /**
   * Find all active users
   */
  async findActiveUsers(pagination = { page: 1, limit: 10 }) {
    return await this.findAll({ status: true }, pagination);
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    const query = `SELECT * FROM ${this.tableName} WHERE username = ? LIMIT 1`;
    const results = await this.executeCustomQuery(query, [username]);
    return results[0] || null;
  }

  /**
   * Find users by customer ID
   */
  async findByCustomerId(customerId, pagination = { page: 1, limit: 10 }) {
    return await this.findAll({ customer_id: customerId }, pagination);
  }

  /**
   * Find user with customer information
   */
  async findByIdWithCustomer(id) {
    const query = `
      SELECT u.*, c.name as customer_name
      FROM users u
      JOIN customers c ON u.customer_id = c.id
      WHERE u.id = ?
    `;

    const results = await this.executeCustomQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Update user status
   */
  async updateStatus(id, status) {
    return await this.update(id, { status });
  }

  /**
   * Check if username exists
   */
  async usernameExists(username, excludeId = null) {
    let query = `SELECT COUNT(*) as count FROM ${this.tableName} WHERE username = ?`;
    const params = [username];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const result = await this.executeCustomQuery(query, params);
    return result[0].count > 0;
  }
}

module.exports = UserRepository; 