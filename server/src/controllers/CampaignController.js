const response = require('../utils/response');

/**
 * Campaign Controller
 * Implements Controller Pattern and Dependency Inversion Principle
 * Handles HTTP requests and delegates business logic to services
 */
class CampaignController {
  constructor(campaignService) {
    this.campaignService = campaignService;
  }

  /**
   * List campaigns with filters and pagination
   */
  async list(event) {
    try {
      const queryParams = event.queryStringParameters || {};
      const { start_date, end_date, user_id, status, page = 1, limit = 10 } = queryParams;
      
      const filters = {};
      if (start_date) filters.start_date = start_date;
      if (end_date) filters.end_date = end_date;
      if (user_id) filters.user_id = user_id;
      if (status !== undefined) filters.process_status = status;

      const pagination = { 
        page: Number(page), 
        limit: Number(limit) 
      };

      const result = await this.campaignService.getAll(filters, pagination);

      if (!result.success) {
        console.error('❌ Service error:', result.error, result.details);
        return response.error(result.error, 500, result.details);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('❌ Error in CampaignController.list:', error);
      return response.error('Failed to list campaigns', 500, error.message);
    }
  }

  /**
   * Get campaign by ID
   */
  async getById(event) {
    try {
      const { id } = event.pathParameters;

      if (!id || isNaN(id)) {
        return response.error('Invalid campaign ID', 400);
      }

      const result = await this.campaignService.getById(id);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in CampaignController.getById:', error);
      return response.error('Failed to get campaign');
    }
  }

  /**
   * Create new campaign
   */
  async create(event) {
    try {
      const body = JSON.parse(event.body);
      const result = await this.campaignService.create(body);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data, result.statusCode || 200);
    } catch (error) {
      console.error('Error in CampaignController.create:', error);
      return response.error('Failed to create campaign');
    }
  }

  /**
   * Update campaign
   */
  async update(event) {
    try {
      const { id } = event.pathParameters;
      const body = JSON.parse(event.body);

      if (!id || isNaN(id)) {
        return response.error('Invalid campaign ID', 400);
      }

      const result = await this.campaignService.update(id, body);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in CampaignController.update:', error);
      return response.error('Failed to update campaign');
    }
  }

  /**
   * Delete campaign
   */
  async delete(event) {
    try {
      const { id } = event.pathParameters;

      if (!id || isNaN(id)) {
        return response.error('Invalid campaign ID', 400);
      }

      const result = await this.campaignService.delete(id);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in CampaignController.delete:', error);
      return response.error('Failed to delete campaign');
    }
  }

  /**
   * Process campaign (send messages)
   */
  async process(event) {
    try {
      const { id } = event.pathParameters;

      if (!id || isNaN(id)) {
        return response.error('Invalid campaign ID', 400);
      }

      const result = await this.campaignService.processCampaign(id);

      if (!result.success) {
        return response.error(result.error, result.statusCode || 500);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in CampaignController.process:', error);
      return response.error('Failed to process campaign');
    }
  }
}

module.exports = CampaignController; 