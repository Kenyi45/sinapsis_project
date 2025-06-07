const serviceFactory = require('../core/factories/ServiceFactory');

/**
 * User Handlers - Refactored Architecture
 * Uses SOLID principles and design patterns
 */

// Get user controller instance from factory
const userController = serviceFactory.getController('user');

/**
 * List users
 */
const list = async (event) => {
  return await userController.list(event);
};

/**
 * Get active users
 */
const getActiveUsers = async (event) => {
  return await userController.getActiveUsers(event);
};

module.exports = {
  list,
  getActiveUsers
}; 