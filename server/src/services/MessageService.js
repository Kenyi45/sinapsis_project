/**
 * Message Service
 * Implements Service Layer Pattern and Single Responsibility Principle
 * Handles all message business logic
 */
class MessageService {
  constructor(messageRepository, campaignRepository) {
    this.messageRepository = messageRepository;
    this.campaignRepository = campaignRepository;
  }

  async getByCampaignId(campaignId, filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      // Verify campaign exists
      const campaign = await this.campaignRepository.findById(campaignId);
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found',
          statusCode: 404
        };
      }

      // Get messages
      const messages = await this.messageRepository.findByCampaignId(campaignId, filters, pagination);
      const total = await this.messageRepository.countByCampaignId(campaignId, filters.status);
      const stats = await this.messageRepository.getStatsByCampaignId(campaignId);

      // Process messages with status text
      const processedMessages = messages.map(message => ({
        ...message,
        status_text: this._getStatusText(message.shipping_status)
      }));

      return {
        success: true,
        data: {
          campaign: {
            id: campaign.id,
            name: campaign.name
          },
          messages: processedMessages,
          statistics: stats,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            pages: Math.ceil(total / pagination.limit)
          }
        }
      };
    } catch (error) {
      console.error('Error in MessageService.getByCampaignId:', error);
      return {
        success: false,
        error: 'Failed to retrieve messages',
        details: error.message
      };
    }
  }

  async getById(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid message ID',
          statusCode: 400
        };
      }

      const message = await this.messageRepository.findByIdWithDetails(id);
      
      if (!message) {
        return {
          success: false,
          error: 'Message not found',
          statusCode: 404
        };
      }

      const processedMessage = {
        ...message,
        status_text: this._getStatusText(message.shipping_status)
      };

      return {
        success: true,
        data: processedMessage
      };
    } catch (error) {
      console.error('Error in MessageService.getById:', error);
      return {
        success: false,
        error: 'Failed to retrieve message',
        details: error.message
      };
    }
  }

  async getStats(campaignId = null) {
    try {
      const generalStats = await this.messageRepository.getGeneralStats(campaignId);
      const dailyStats = await this.messageRepository.getDailyStats(campaignId);

      return {
        success: true,
        data: {
          general_stats: generalStats,
          daily_stats: dailyStats
        }
      };
    } catch (error) {
      console.error('Error in MessageService.getStats:', error);
      return {
        success: false,
        error: 'Failed to retrieve message statistics',
        details: error.message
      };
    }
  }

  async updateStatus(id, status) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid message ID',
          statusCode: 400
        };
      }

      if (![0, 1, 2].includes(status)) {
        return {
          success: false,
          error: 'Invalid status. Must be 0 (pending), 1 (sent), or 2 (failed)',
          statusCode: 400
        };
      }

      const message = await this.messageRepository.findById(id);
      if (!message) {
        return {
          success: false,
          error: 'Message not found',
          statusCode: 404
        };
      }

      const result = await this.messageRepository.updateStatus(id, status);

      if (result.affectedRows === 0) {
        return {
          success: false,
          error: 'No changes made to message',
          statusCode: 400
        };
      }

      const updatedMessage = await this.messageRepository.findById(id);

      return {
        success: true,
        data: {
          ...updatedMessage,
          status_text: this._getStatusText(updatedMessage.shipping_status)
        }
      };
    } catch (error) {
      console.error('Error in MessageService.updateStatus:', error);
      return {
        success: false,
        error: 'Failed to update message status',
        details: error.message
      };
    }
  }

  /**
   * Get status text from status code
   * @private
   */
  _getStatusText(status) {
    switch (status) {
      case 0: return 'Pending';
      case 1: return 'Sent';
      case 2: return 'Failed';
      default: return 'Unknown';
    }
  }
}

module.exports = MessageService; 