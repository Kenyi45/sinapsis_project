const BaseRepository = require('../core/repositories/BaseRepository');

/**
 * Message Repository
 * Implements Repository Pattern with specific message operations
 * Follows Single Responsibility Principle
 */
class MessageRepository extends BaseRepository {
  constructor() {
    super('messages');
  }

  /**
   * Find messages by campaign ID with campaign information
   */
  async findByCampaignId(campaignId, filters = {}, pagination = { page: 1, limit: 10 }) {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT m.*, c.name as campaign_name 
      FROM messages m 
      JOIN campaigns c ON m.campaign_id = c.id 
      WHERE m.campaign_id = ?
    `;
    
    const params = [campaignId];

    // Apply status filter if provided
    if (filters.status !== undefined) {
      query += ' AND m.shipping_status = ?';
      params.push(filters.status);
    }

    query += ` ORDER BY m.created_at DESC LIMIT ${limit} OFFSET ${offset}`;

    return await this.executeCustomQuery(query, params);
  }

  /**
   * Count messages by campaign ID with optional status filter
   */
  async countByCampaignId(campaignId, statusFilter = null) {
    let query = 'SELECT COUNT(*) as total FROM messages WHERE campaign_id = ?';
    const params = [campaignId];

    if (statusFilter !== null) {
      query += ' AND shipping_status = ?';
      params.push(statusFilter);
    }

    const result = await this.executeCustomQuery(query, params);
    return result[0].total;
  }

  /**
   * Get message statistics for a campaign
   */
  async getStatsByCampaignId(campaignId) {
    const query = `
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN shipping_status = 0 THEN 1 ELSE 0 END) as pending_messages,
        SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as sent_messages,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as failed_messages
      FROM messages 
      WHERE campaign_id = ?
    `;

    const results = await this.executeCustomQuery(query, [campaignId]);
    return results[0] || {
      total_messages: 0,
      pending_messages: 0,
      sent_messages: 0,
      failed_messages: 0
    };
  }

  /**
   * Find message by ID with campaign and user information
   */
  async findByIdWithDetails(id) {
    const query = `
      SELECT m.*, c.name as campaign_name, c.user_id,
             u.username, cu.name as customer_name
      FROM messages m 
      JOIN campaigns c ON m.campaign_id = c.id 
      JOIN users u ON c.user_id = u.id
      JOIN customers cu ON u.customer_id = cu.id
      WHERE m.id = ?
    `;

    const results = await this.executeCustomQuery(query, [id]);
    return results[0] || null;
  }

  /**
   * Get general message statistics
   */
  async getGeneralStats(campaignId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_messages,
        SUM(CASE WHEN shipping_status = 0 THEN 1 ELSE 0 END) as pending_messages,
        SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as sent_messages,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as failed_messages,
        COUNT(DISTINCT campaign_id) as total_campaigns
      FROM messages
    `;

    const params = [];

    if (campaignId) {
      query += ' WHERE campaign_id = ?';
      params.push(campaignId);
    }

    const results = await this.executeCustomQuery(query, params);
    return results[0];
  }

  /**
   * Get daily statistics for the last 7 days
   */
  async getDailyStats(campaignId = null) {
    let query = `
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_messages,
        SUM(CASE WHEN shipping_status = 1 THEN 1 ELSE 0 END) as sent_messages,
        SUM(CASE WHEN shipping_status = 2 THEN 1 ELSE 0 END) as failed_messages
      FROM messages
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `;

    const params = [];

    if (campaignId) {
      query += ' AND campaign_id = ?';
      params.push(campaignId);
    }

    query += `
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `;

    return await this.executeCustomQuery(query, params);
  }

  /**
   * Update message status
   */
  async updateStatus(id, status) {
    return await this.update(id, { shipping_status: status });
  }

  /**
   * Bulk create messages for a campaign
   */
  async bulkCreate(messages) {
    if (!messages || messages.length === 0) {
      return { insertedCount: 0 };
    }

    const fields = Object.keys(messages[0]);
    const placeholders = fields.map(() => '?').join(', ');
    const valuesPlaceholder = `(${placeholders})`;
    const allValuesPlaceholder = messages.map(() => valuesPlaceholder).join(', ');

    const query = `INSERT INTO ${this.tableName} (${fields.join(', ')}) VALUES ${allValuesPlaceholder}`;
    
    const allValues = messages.flatMap(message => Object.values(message));
    
    const result = await this.executeCustomQuery(query, allValues);
    return {
      insertedCount: result.affectedRows,
      firstInsertId: result.insertId
    };
  }
}

module.exports = MessageRepository; 