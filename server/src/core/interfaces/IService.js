/**
 * Base Service Interface
 * Implements Single Responsibility Principle (SRP)
 * Services handle business logic only
 */
class IService {
  constructor(repository) {
    if (!repository) {
      throw new Error('Repository is required');
    }
    this.repository = repository;
  }

  async getAll(filters = {}, pagination = {}) {
    throw new Error('Method getAll must be implemented');
  }

  async getById(id) {
    throw new Error('Method getById must be implemented');
  }

  async create(data) {
    throw new Error('Method create must be implemented');
  }

  async update(id, data) {
    throw new Error('Method update must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete must be implemented');
  }
}

module.exports = IService; 