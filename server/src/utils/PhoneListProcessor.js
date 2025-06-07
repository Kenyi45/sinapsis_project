/**
 * Phone List Processor
 * Implements Single Responsibility Principle
 * Handles all phone list parsing and validation operations
 */
class PhoneListProcessor {
  /**
   * Parse phone list from various formats
   * @param {string|Array} phoneListData - Phone list data to parse
   * @returns {Array} - Array of phone numbers
   */
  static parsePhoneList(phoneListData) {
    try {
      if (!phoneListData) return [];

      // If already an array, return as is
      if (Array.isArray(phoneListData)) {
        return phoneListData.map(phone => this.formatPhoneNumber(phone));
      }

      // Try to parse as JSON first
      if (typeof phoneListData === 'string') {
        try {
          const parsed = JSON.parse(phoneListData);
          if (Array.isArray(parsed)) {
            return parsed.map(phone => this.formatPhoneNumber(phone));
          }
        } catch (jsonError) {
          // If JSON parsing fails, treat as CSV or single phone
          console.warn(`Invalid JSON in phone_list, treating as CSV:`, phoneListData);
        }

        // If not JSON, split by comma and clean up
        return phoneListData
          .split(',')
          .map(phone => this.formatPhoneNumber(phone.trim()))
          .filter(phone => phone.length > 0);
      }

      return [];
    } catch (error) {
      console.error('Error parsing phone list:', phoneListData, error);
      return [];
    }
  }

  /**
   * Format phone number to standard format
   * @param {string} phoneNumber - Phone number to format
   * @returns {string} - Formatted phone number
   */
  static formatPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return '';
    }

    // Remove all non-digit characters except + at the beginning
    let cleaned = phoneNumber.replace(/[^\d+]/g, '');
    
    // If starts with +, keep it
    if (phoneNumber.startsWith('+')) {
      cleaned = '+' + cleaned.substring(1);
    }

    return cleaned;
  }

  /**
   * Validate phone number format
   * @param {string} phoneNumber - Phone number to validate
   * @returns {boolean} - True if valid phone number
   */
  static isValidPhoneNumber(phoneNumber) {
    if (!phoneNumber || typeof phoneNumber !== 'string') {
      return false;
    }

    // Basic validation: should have at least 7 digits
    const digitsOnly = phoneNumber.replace(/[^\d]/g, '');
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  }

  /**
   * Validate entire phone list
   * @param {Array} phoneList - Array of phone numbers to validate
   * @returns {object} - Validation result with valid and invalid phones
   */
  static validatePhoneList(phoneList) {
    const valid = [];
    const invalid = [];

    phoneList.forEach(phone => {
      if (this.isValidPhoneNumber(phone)) {
        valid.push(phone);
      } else {
        invalid.push(phone);
      }
    });

    return {
      valid,
      invalid,
      isValid: invalid.length === 0,
      totalCount: phoneList.length,
      validCount: valid.length,
      invalidCount: invalid.length
    };
  }

  /**
   * Convert phone list to JSON string for storage
   * @param {Array} phoneList - Array of phone numbers
   * @returns {string} - JSON string representation
   */
  static toJsonString(phoneList) {
    try {
      if (!Array.isArray(phoneList)) {
        return JSON.stringify([]);
      }

      const formattedList = phoneList.map(phone => this.formatPhoneNumber(phone));
      return JSON.stringify(formattedList);
    } catch (error) {
      console.error('Error converting phone list to JSON:', phoneList, error);
      return JSON.stringify([]);
    }
  }

  /**
   * Remove duplicates from phone list
   * @param {Array} phoneList - Array of phone numbers
   * @returns {Array} - Array without duplicates
   */
  static removeDuplicates(phoneList) {
    if (!Array.isArray(phoneList)) {
      return [];
    }

    const seen = new Set();
    return phoneList.filter(phone => {
      const formatted = this.formatPhoneNumber(phone);
      if (seen.has(formatted)) {
        return false;
      }
      seen.add(formatted);
      return true;
    });
  }

  /**
   * Get phone list statistics
   * @param {Array} phoneList - Array of phone numbers
   * @returns {object} - Statistics about the phone list
   */
  static getStatistics(phoneList) {
    if (!Array.isArray(phoneList)) {
      return {
        total: 0,
        unique: 0,
        duplicates: 0,
        valid: 0,
        invalid: 0
      };
    }

    const validation = this.validatePhoneList(phoneList);
    const unique = this.removeDuplicates(phoneList);

    return {
      total: phoneList.length,
      unique: unique.length,
      duplicates: phoneList.length - unique.length,
      valid: validation.validCount,
      invalid: validation.invalidCount
    };
  }
}

module.exports = PhoneListProcessor; 