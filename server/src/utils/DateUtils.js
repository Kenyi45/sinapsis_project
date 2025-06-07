/**
 * Date Utilities
 * Implements Single Responsibility Principle
 * Handles all date formatting operations
 */
class DateUtils {
  /**
   * Format date for MySQL storage
   * @param {string|Date} dateValue - Date to format
   * @returns {string} - Formatted date in YYYY-MM-DD format
   */
  static formatForMySQL(dateValue) {
    try {
      if (!dateValue) return new Date().toISOString().split('T')[0];
      
      // If already in format YYYY-MM-DD, return as is
      if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        return dateValue;
      }
      
      // Convert to Date and format
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value, using current date:', dateValue);
        return new Date().toISOString().split('T')[0];
      }
      
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Error formatting date, using current date:', dateValue, error);
      return new Date().toISOString().split('T')[0];
    }
  }

  /**
   * Format time for MySQL storage
   * @param {string} timeValue - Time to format
   * @returns {string} - Formatted time in HH:MM:SS format
   */
  static formatTimeForMySQL(timeValue) {
    try {
      if (!timeValue) return '00:00:00';
      
      // If already in format HH:MM:SS, return as is
      if (typeof timeValue === 'string' && /^\d{2}:\d{2}:\d{2}$/.test(timeValue)) {
        return timeValue;
      }
      
      // If in format HH:MM, add seconds
      if (typeof timeValue === 'string' && /^\d{2}:\d{2}$/.test(timeValue)) {
        return `${timeValue}:00`;
      }
      
      return '00:00:00';
    } catch (error) {
      console.warn('Error formatting time, using default:', timeValue, error);
      return '00:00:00';
    }
  }

  /**
   * Get current timestamp for MySQL
   * @returns {string} - Current timestamp in YYYY-MM-DD HH:MM:SS format
   */
  static getCurrentTimestamp() {
    return new Date().toISOString().slice(0, 19).replace('T', ' ');
  }

  /**
   * Check if date is valid
   * @param {string|Date} dateValue - Date to validate
   * @returns {boolean} - True if valid date
   */
  static isValidDate(dateValue) {
    try {
      const date = new Date(dateValue);
      return !isNaN(date.getTime());
    } catch (error) {
      return false;
    }
  }

  /**
   * Add days to a date
   * @param {string|Date} dateValue - Base date
   * @param {number} days - Number of days to add
   * @returns {string} - New date in YYYY-MM-DD format
   */
  static addDays(dateValue, days) {
    try {
      const date = new Date(dateValue);
      date.setDate(date.getDate() + days);
      return this.formatForMySQL(date);
    } catch (error) {
      console.warn('Error adding days to date:', dateValue, days, error);
      return this.formatForMySQL(new Date());
    }
  }

  /**
   * Get date range for filtering
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @returns {object} - Formatted date range
   */
  static getDateRange(startDate, endDate) {
    return {
      start: this.formatForMySQL(startDate),
      end: this.formatForMySQL(endDate)
    };
  }
}

module.exports = DateUtils; 