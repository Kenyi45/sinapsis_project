const serviceFactory = require('../core/factories/ServiceFactory');

/**
 * Message Handlers - Refactored Architecture
 * Uses SOLID principles and design patterns
 */

// Get message controller instance from factory
const messageController = serviceFactory.getController('message');

/**
 * Get messages by campaign ID
 */
const getByCampaign = async (event) => {
  return await messageController.getByCampaign(event);
};

/**
 * Get message by ID
 */
const getById = async (event) => {
  return await messageController.getById(event);
};

/**
 * Get message statistics
 */
const getStats = async (event) => {
  return await messageController.getStats(event);
};

module.exports = {
  getByCampaign,
  getById,
  getStats
}; 