const response = require('../utils/response');

/**
 * User Controller
 * Implements Controller Pattern and Dependency Inversion Principle
 */
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  async list(event) {
    try {
      const queryParams = event.queryStringParameters || {};
      const { page = 1, limit = 10, status } = queryParams;
      
      const filters = {};
      if (status !== undefined) filters.status = status === 'true';

      const pagination = { 
        page: Number(page), 
        limit: Number(limit) 
      };

      const result = await this.userService.getAll(filters, pagination);

      if (!result.success) {
        return response.error(result.error);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in UserController.list:', error);
      return response.error('Failed to list users');
    }
  }

  async getActiveUsers(event) {
    try {
      const queryParams = event.queryStringParameters || {};
      const { page = 1, limit = 10 } = queryParams;

      const pagination = { 
        page: Number(page), 
        limit: Number(limit) 
      };

      const result = await this.userService.getActiveUsers(pagination);

      if (!result.success) {
        return response.error(result.error);
      }

      return response.success(result.data);
    } catch (error) {
      console.error('Error in UserController.getActiveUsers:', error);
      return response.error('Failed to get active users');
    }
  }
}

module.exports = UserController; 