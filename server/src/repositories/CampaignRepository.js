const BaseRepository = require('../core/repositories/BaseRepository');

/**
 * Campaign Repository
 * Implements Repository Pattern with specific campaign operations
 * Follows Single Responsibility Principle
 */
class CampaignRepository extends BaseRepository {
  constructor() {
    super('campaigns');
  }

  /**
   * Find campaigns with user information and message statistics
   */
  async findAllWithStats(filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    
    // Build WHERE clause based on filters
    let whereClause = '1=1';
    const queryParams = [];
    
    if (filters.user_id) {
      whereClause += ' AND c.user_id = ?';
      queryParams.push(filters.user_id);
    }
    
    if (filters.start_date) {
      whereClause += ' AND c.process_date >= ?';
      queryParams.push(filters.start_date);
    }
    
    if (filters.end_date) {
      whereClause += ' AND c.process_date <= ?';
      queryParams.push(filters.end_date);
    }
    
    if (filters.process_status !== undefined) {
      whereClause += ' AND c.process_status = ?';
      queryParams.push(filters.process_status);
    }
    
    const query = `
      SELECT c.id, c.user_id, c.name, c.process_date, c.process_hour, 
             c.process_status, c.phone_list, c.message_text, c.created_at, c.updated_at,
             u.username,
             COALESCE(m.total_messages, 0) as total_messages,
             COALESCE(m.sent_messages, 0) as sent_messages,
             COALESCE(m.pending_messages, 0) as pending_messages,
             COALESCE(m.failed_messages, 0) as failed_messages
      FROM campaigns c 
      JOIN users u ON c.user_id = u.id 
      LEFT JOIN (
        SELECT campaign_id,
               COUNT(*) as total_messages,
               SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as sent_messages,
               SUM(CASE WHEN shipping_status = 0 THEN 1 ELSE 0 END) as pending_messages,
               SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as failed_messages
        FROM messages 
        GROUP BY campaign_id
      ) m ON c.id = m.campaign_id
      WHERE ${whereClause}
      ORDER BY c.created_at DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;

    return await this.executeCustomQuery(query, queryParams);
  }

  /**
   * Find campaign by ID with user information
   */
  async findByIdWithUser(id) {
    const query = `
      SELECT c.id, c.user_id, c.name, c.process_date, c.process_hour, 
             c.process_status, c.phone_list, c.message_text, c.created_at, c.updated_at,
             u.username
      FROM campaigns c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = ?
    `;

    const results = await this.executeCustomQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Get campaign statistics
   */
  async getCampaignStatistics(campaignId) {
    const query = `
      SELECT 
        COUNT(id) as total_messages,
        SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as sent_messages,
        SUM(CASE WHEN shipping_status = 0 THEN 1 ELSE 0 END) as pending_messages,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as failed_messages
      FROM messages 
      WHERE campaign_id = ?
    `;

    const results = await this.executeCustomQuery(query, [campaignId]);
    return results[0] || { 
      total_messages: 0, 
      sent_messages: 0, 
      pending_messages: 0, 
      failed_messages: 0 
    };
  }

  /**
   * Update campaign status
   */
  async updateStatus(id, status) {
    return await this.update(id, { process_status: status });
  }

  /**
   * Find campaigns by user ID
   */
  async findByUserId(userId, pagination = { page: 1, limit: 10 }) {
    return await this.findAll({ user_id: userId }, pagination);
  }

  /**
   * Find campaigns by status
   */
  async findByStatus(status, pagination = { page: 1, limit: 10 }) {
    return await this.findAll({ process_status: status }, pagination);
  }

  /**
   * Count campaigns with filters (override base method)
   */
  async count(filters = {}) {
    // Build WHERE clause based on filters
    let whereClause = '1=1';
    const queryParams = [];
    
    if (filters.user_id) {
      whereClause += ' AND c.user_id = ?';
      queryParams.push(filters.user_id);
    }
    
    if (filters.start_date) {
      whereClause += ' AND c.process_date >= ?';
      queryParams.push(filters.start_date);
    }
    
    if (filters.end_date) {
      whereClause += ' AND c.process_date <= ?';
      queryParams.push(filters.end_date);
    }
    
    if (filters.process_status !== undefined) {
      whereClause += ' AND c.process_status = ?';
      queryParams.push(filters.process_status);
    }
    
    const query = `
      SELECT COUNT(*) as total 
      FROM campaigns c 
      JOIN users u ON c.user_id = u.id 
      WHERE ${whereClause}
    `;

    const result = await this.executeCustomQuery(query, queryParams);
    return result[0].total;
  }
}

module.exports = CampaignRepository; 