/**
 * User Service
 * Implements Service Layer Pattern and Single Responsibility Principle
 * Handles all user business logic
 */
class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      const users = await this.userRepository.findAll(filters, pagination);
      const total = await this.userRepository.count(filters);

      return {
        success: true,
        data: {
          users,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            pages: Math.ceil(total / pagination.limit)
          }
        }
      };
    } catch (error) {
      console.error('Error in UserService.getAll:', error);
      return {
        success: false,
        error: 'Failed to retrieve users'
      };
    }
  }

  async getActiveUsers(pagination = { page: 1, limit: 10 }) {
    try {
      const users = await this.userRepository.findActiveUsers(pagination);
      const total = await this.userRepository.count({ status: true });

      return {
        success: true,
        data: {
          users,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            pages: Math.ceil(total / pagination.limit)
          }
        }
      };
    } catch (error) {
      console.error('Error in UserService.getActiveUsers:', error);
      return {
        success: false,
        error: 'Failed to retrieve active users'
      };
    }
  }

  async getById(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid user ID',
          statusCode: 400
        };
      }

      const user = await this.userRepository.findByIdWithCustomer(id);
      
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404
        };
      }

      return {
        success: true,
        data: user
      };
    } catch (error) {
      console.error('Error in UserService.getById:', error);
      return {
        success: false,
        error: 'Failed to retrieve user',
        details: error.message
      };
    }
  }

  async create(userData) {
    try {
      const { username, customer_id, status = true } = userData;

      // Check if username already exists
      const usernameExists = await this.userRepository.usernameExists(username);
      if (usernameExists) {
        return {
          success: false,
          error: 'Username already exists',
          statusCode: 400
        };
      }

      const userToCreate = {
        username,
        customer_id,
        status
      };

      const result = await this.userRepository.create(userToCreate);
      const createdUser = await this.userRepository.findByIdWithCustomer(result.insertId);

      return {
        success: true,
        data: createdUser,
        statusCode: 201
      };
    } catch (error) {
      console.error('Error in UserService.create:', error);
      return {
        success: false,
        error: 'Failed to create user',
        details: error.message
      };
    }
  }

  async update(id, updateData) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid user ID',
          statusCode: 400
        };
      }

      // Check if user exists
      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404
        };
      }

      // Check username uniqueness if username is being updated
      if (updateData.username && updateData.username !== existingUser.username) {
        const usernameExists = await this.userRepository.usernameExists(updateData.username, id);
        if (usernameExists) {
          return {
            success: false,
            error: 'Username already exists',
            statusCode: 400
          };
        }
      }

      const result = await this.userRepository.update(id, updateData);

      if (result.affectedRows === 0) {
        return {
          success: false,
          error: 'No changes made to user',
          statusCode: 400
        };
      }

      const updatedUser = await this.userRepository.findByIdWithCustomer(id);

      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Error in UserService.update:', error);
      return {
        success: false,
        error: 'Failed to update user',
        details: error.message
      };
    }
  }

  async updateStatus(id, status) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid user ID',
          statusCode: 400
        };
      }

      if (typeof status !== 'boolean') {
        return {
          success: false,
          error: 'Status must be a boolean value',
          statusCode: 400
        };
      }

      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404
        };
      }

      const result = await this.userRepository.updateStatus(id, status);

      if (result.affectedRows === 0) {
        return {
          success: false,
          error: 'No changes made to user status',
          statusCode: 400
        };
      }

      const updatedUser = await this.userRepository.findByIdWithCustomer(id);

      return {
        success: true,
        data: updatedUser
      };
    } catch (error) {
      console.error('Error in UserService.updateStatus:', error);
      return {
        success: false,
        error: 'Failed to update user status',
        details: error.message
      };
    }
  }

  async delete(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid user ID',
          statusCode: 400
        };
      }

      const existingUser = await this.userRepository.findById(id);
      if (!existingUser) {
        return {
          success: false,
          error: 'User not found',
          statusCode: 404
        };
      }

      const result = await this.userRepository.delete(id);

      return {
        success: true,
        data: {
          message: 'User deleted successfully',
          deletedRows: result.affectedRows
        }
      };
    } catch (error) {
      console.error('Error in UserService.delete:', error);
      return {
        success: false,
        error: 'Failed to delete user',
        details: error.message
      };
    }
  }
}

module.exports = UserService; 