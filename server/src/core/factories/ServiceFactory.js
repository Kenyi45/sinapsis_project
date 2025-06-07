const CampaignRepository = require('../../repositories/CampaignRepository');
const MessageRepository = require('../../repositories/MessageRepository');
const UserRepository = require('../../repositories/UserRepository');

const CampaignService = require('../../services/CampaignService');
const MessageService = require('../../services/MessageService');
const UserService = require('../../services/UserService');

const CampaignController = require('../../controllers/CampaignController');
const MessageController = require('../../controllers/MessageController');
const UserController = require('../../controllers/UserController');

/**
 * Service Factory
 * Implements Factory Pattern and Dependency Injection Container
 * Manages object creation and dependency resolution
 */
class ServiceFactory {
  constructor() {
    this.repositories = {};
    this.services = {};
    this.controllers = {};
    this._initializeRepositories();
    this._initializeServices();
    this._initializeControllers();
  }

  /**
   * Initialize all repositories
   * @private
   */
  _initializeRepositories() {
    this.repositories.campaign = new CampaignRepository();
    this.repositories.message = new MessageRepository();
    this.repositories.user = new UserRepository();
  }

  /**
   * Initialize all services with dependency injection
   * @private
   */
  _initializeServices() {
    this.services.campaign = new CampaignService(
      this.repositories.campaign,
      this.repositories.message,
      this.repositories.user
    );

    this.services.message = new MessageService(
      this.repositories.message,
      this.repositories.campaign
    );

    this.services.user = new UserService(
      this.repositories.user
    );
  }

  /**
   * Initialize all controllers with dependency injection
   * @private
   */
  _initializeControllers() {
    this.controllers.campaign = new CampaignController(this.services.campaign);
    this.controllers.message = new MessageController(this.services.message);
    this.controllers.user = new UserController(this.services.user);
  }

  /**
   * Get repository instance
   */
  getRepository(name) {
    if (!this.repositories[name]) {
      throw new Error(`Repository '${name}' not found`);
    }
    return this.repositories[name];
  }

  /**
   * Get service instance
   */
  getService(name) {
    if (!this.services[name]) {
      throw new Error(`Service '${name}' not found`);
    }
    return this.services[name];
  }

  /**
   * Get controller instance
   */
  getController(name) {
    if (!this.controllers[name]) {
      throw new Error(`Controller '${name}' not found`);
    }
    return this.controllers[name];
  }

  /**
   * Get all available repositories
   */
  getAllRepositories() {
    return { ...this.repositories };
  }

  /**
   * Get all available services
   */
  getAllServices() {
    return { ...this.services };
  }

  /**
   * Get all available controllers
   */
  getAllControllers() {
    return { ...this.controllers };
  }

  /**
   * Register custom repository
   */
  registerRepository(name, repository) {
    this.repositories[name] = repository;
  }

  /**
   * Register custom service
   */
  registerService(name, service) {
    this.services[name] = service;
  }

  /**
   * Register custom controller
   */
  registerController(name, controller) {
    this.controllers[name] = controller;
  }

  /**
   * Test all database connections
   */
  async testConnections() {
    try {
      const campaignRepo = this.getRepository('campaign');
      await campaignRepo.db.testConnection();
      console.log('✅ All database connections tested successfully');
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }
}

// Export singleton instance
module.exports = new ServiceFactory(); 