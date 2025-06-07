const response = require('../utils/response');

/**
 * Message Controller
 * Implements Controller Pattern and Dependency Inversion Principle
 */
class MessageController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  async getByCampaign(event) {
    try {
      const { campaignId } = event.pathParameters;
      const queryParams = event.queryStringParameters || {};

      if (!campaignId || isNaN(campaignId)) {
        return response.error('Invalid campaign ID', 400);
      }

      const { status, page = 1, limit = 10 } = queryParams;
      
      const filters = {};
      if (status !== undefined) filters.status = Number(status);

      const pagination = { 
        page: Number(page), 
        limit: Number(limit) 
      };

      const result = await this.messageService.getByCampaignId(campaignId, filters, pagination);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in MessageController.getByCampaign:', error);
      return response.error('Failed to get campaign messages');
    }
  }

  async getById(event) {
    try {
      const { id } = event.pathParameters;

      if (!id || isNaN(id)) {
        return response.error('Invalid message ID', 400);
      }

      const result = await this.messageService.getById(id);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in MessageController.getById:', error);
      return response.error('Failed to get message');
    }
  }

  async getStats(event) {
    try {
      const queryParams = event.queryStringParameters || {};
      const { campaign_id } = queryParams;

      const result = await this.messageService.getStats(campaign_id);

      if (!result.success) {
        return response.error(result.error);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in MessageController.getStats:', error);
      return response.error('Failed to get message statistics');
    }
  }
}

module.exports = MessageController; 