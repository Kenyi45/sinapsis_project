const serviceFactory = require('../core/factories/ServiceFactory');
    
/**
 * Campaign Handlers - Refactored Architecture
 * Uses SOLID principles and design patterns
 */

// Get campaign controller instance from factory
const campaignController = serviceFactory.getController('campaign');

/**
 * List campaigns with filters and pagination
 */
const list = async (event) => {
  return await campaignController.list(event);
};

/**
 * Get campaign by ID
 */
const getById = async (event) => {
  return await campaignController.getById(event);
};

/**
 * Create new campaign
 */
const create = async (event) => {
  return await campaignController.create(event);
};

/**
 * Update existing campaign
 */
const update = async (event) => {
  return await campaignController.update(event);
};

/**
 * Delete campaign
 */
const deleteCampaign = async (event) => {
  return await campaignController.delete(event);
};

/**
 * Process campaign (send messages)
 */
const process = async (event) => {
  return await campaignController.process(event);
};

/**
 * Health check for campaigns module
 */
const health = async (event) => {
  try {
    const isHealthy = await serviceFactory.testConnections();

    if (isHealthy) {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE'
        },
        body: JSON.stringify({
          success: true,
          message: 'Campaigns module is healthy',
          timestamp: new Date().toISOString(),
          services: {
            database: 'connected',
            campaign_service: 'active',
            message_service: 'active'
          }
        })
      };
    } else {
      return {
        statusCode: 503,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: 'Campaigns module is unhealthy',
          timestamp: new Date().toISOString(),
          services: {
            database: 'disconnected'
          }
        })
      };
    }
  } catch (error) {
    console.error('Health check failed:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Health check failed',
        error: error.message,
        timestamp: new Date().toISOString()
      })
    };
  }
};

module.exports = {
  list,
  getById,
  create,
  update,
  delete: deleteCampaign,
  process,
  health
}; 