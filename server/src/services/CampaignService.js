const IService = require('../core/interfaces/IService');
const CampaignRepository = require('../repositories/CampaignRepository');
const MessageRepository = require('../repositories/MessageRepository');
const UserRepository = require('../repositories/UserRepository');
const DateUtils = require('../utils/DateUtils');
const PhoneListProcessor = require('../utils/PhoneListProcessor');

/**
 * Campaign Service
 * Implements Service Layer Pattern and Single Responsibility Principle
 * Handles all campaign business logic
 */
class CampaignService extends IService {
  constructor(campaignRepository, messageRepository, userRepository) {
    // Dependency Injection (Dependency Inversion Principle)
    super(campaignRepository || new CampaignRepository());
    this.messageRepository = messageRepository || new MessageRepository();
    this.userRepository = userRepository || new UserRepository();
  }

  async getAll(filters = {}, pagination = { page: 1, limit: 10 }) {
    try {
      // Get campaigns with statistics
      const campaigns = await this.repository.findAllWithStats(filters, pagination);
      const total = await this.repository.count(filters);

      // Process phone lists safely
      const processedCampaigns = campaigns.map(campaign => ({
        ...campaign,
        customer_name: 'N/A', // TODO: Add customer relationship
        phone_list: PhoneListProcessor.parsePhoneList(campaign.phone_list),
        total_messages: campaign.total_messages || 0,
        sent_messages: campaign.sent_messages || 0,
        pending_messages: campaign.pending_messages || 0,
        failed_messages: campaign.failed_messages || 0
      }));

      return {
        success: true,
        data: {
          campaigns: processedCampaigns,
          pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total,
            pages: Math.ceil(total / pagination.limit)
          }
        }
      };
    } catch (error) {
      console.error('Error in CampaignService.getAll:', error);
      return {
        success: false,
        error: 'Failed to retrieve campaigns',
        details: error.message
      };
    }
  }

  async getById(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid campaign ID',
          statusCode: 400
        };
      }

      const campaign = await this.repository.findByIdWithUser(id);
      
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found',
          statusCode: 404
        };
      }

      // Get campaign statistics
      const stats = await this.repository.getCampaignStatistics(id);
      
      // Process phone list safely
      const phoneList = PhoneListProcessor.parsePhoneList(campaign.phone_list);

      const processedCampaign = {
        ...campaign,
        customer_name: 'N/A', // TODO: Add customer relationship
        phone_list: phoneList,
        total_messages: stats.total_messages,
        sent_messages: stats.sent_messages,
        pending_messages: stats.pending_messages,
        failed_messages: stats.failed_messages
      };

      return {
        success: true,
        data: processedCampaign
      };
    } catch (error) {
      console.error('Error in CampaignService.getById:', error);
      return {
        success: false,
        error: 'Failed to retrieve campaign',
        details: error.message
      };
    }
  }

  async create(campaignData) {
    try {
      const { user_id, name, process_date, process_hour, phone_list, message_text } = campaignData;

      // Validate user exists
      const user = await this.userRepository.findById(user_id);
      if (!user || !user.status) {
        return {
          success: false,
          error: 'User not found or inactive',
          statusCode: 404
        };
      }

      // Prepare campaign data
      const phoneListJson = JSON.stringify(phone_list);
      const formattedDate = DateUtils.formatForMySQL(process_date);

      const campaignToCreate = {
        user_id,
        name,
        process_date: formattedDate,
        process_hour,
        phone_list: phoneListJson,
        message_text,
        process_status: 0 // Pending
      };

      // Create campaign
      const result = await this.repository.create(campaignToCreate);
      const campaignId = result.insertId;

      // Get the created campaign with user info
      const createdCampaign = await this.repository.findByIdWithUser(campaignId);

      return {
        success: true,
        data: {
          id: campaignId,
          ...createdCampaign,
          phone_list: PhoneListProcessor.parsePhoneList(createdCampaign.phone_list)
        },
        statusCode: 201
      };
    } catch (error) {
      console.error('Error in CampaignService.create:', error);
      return {
        success: false,
        error: 'Failed to create campaign',
        details: error.message
      };
    }
  }

  async update(id, updateData) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid campaign ID',
          statusCode: 400
        };
      }

      // Check if campaign exists
      const existingCampaign = await this.repository.findById(id);
      if (!existingCampaign) {
        return {
          success: false,
          error: 'Campaign not found',
          statusCode: 404
        };
      }

      // Format date if provided
      if (updateData.process_date) {
        updateData.process_date = DateUtils.formatForMySQL(updateData.process_date);
      }

      // Format phone list if provided
      if (updateData.phone_list) {
        updateData.phone_list = JSON.stringify(updateData.phone_list);
      }

      const result = await this.repository.update(id, updateData);

      if (result.affectedRows === 0) {
        return {
          success: false,
          error: 'No changes made to campaign',
          statusCode: 400
        };
      }

      // Get updated campaign
      const updatedCampaign = await this.repository.findByIdWithUser(id);

      return {
        success: true,
        data: {
          ...updatedCampaign,
          phone_list: PhoneListProcessor.parsePhoneList(updatedCampaign.phone_list)
        }
      };
    } catch (error) {
      console.error('Error in CampaignService.update:', error);
      return {
        success: false,
        error: 'Failed to update campaign',
        details: error.message
      };
    }
  }

  async delete(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid campaign ID',
          statusCode: 400
        };
      }

      // Check if campaign exists
      const existingCampaign = await this.repository.findById(id);
      if (!existingCampaign) {
        return {
          success: false,
          error: 'Campaign not found',
          statusCode: 404
        };
      }

      const result = await this.repository.delete(id);

      return {
        success: true,
        data: {
          message: 'Campaign deleted successfully',
          deletedRows: result.affectedRows
        }
      };
    } catch (error) {
      console.error('Error in CampaignService.delete:', error);
      return {
        success: false,
        error: 'Failed to delete campaign',
        details: error.message
      };
    }
  }

  /**
   * Process a campaign (send messages)
   * Implements Command Pattern for campaign processing
   */
  async processCampaign(id) {
    try {
      if (!id || isNaN(id)) {
        return {
          success: false,
          error: 'Invalid campaign ID',
          statusCode: 400
        };
      }

      const campaign = await this.repository.findById(id);
      
      if (!campaign) {
        return {
          success: false,
          error: 'Campaign not found',
          statusCode: 404
        };
      }

      if (campaign.process_status !== 0) {
        return {
          success: false,
          error: 'Campaign has already been processed',
          statusCode: 400
        };
      }

      // Update status to processing
      await this.repository.updateStatus(id, 1);

      try {
        // Get phone list
        const phoneList = PhoneListProcessor.parsePhoneList(campaign.phone_list);

        // Create messages for each phone
        const messages = [];
        for (const phone of phoneList) {
          // Simulate success/failure (90% success rate)
          const shipping_status = Math.random() > 0.1 ? 1 : 2;
          
          messages.push({
            campaign_id: id,
            phone: phone,
            text: campaign.message_text,
            shipping_status: shipping_status,
            process_date: DateUtils.formatForMySQL(campaign.process_date),
            process_hour: campaign.process_hour
          });
        }

        // Bulk create messages
        const messageResult = await this.messageRepository.bulkCreate(messages);

        // Update final campaign status
        const allSent = messages.every(m => m.shipping_status === 1);
        const finalStatus = allSent ? 2 : 3; // 2=completed, 3=completed with errors
        await this.repository.updateStatus(id, finalStatus);

        return {
          success: true,
          data: {
            campaign_id: parseInt(id),
            status: 'processed',
            total_messages: messages.length,
            sent_messages: messages.filter(m => m.shipping_status === 1).length,
            failed_messages: messages.filter(m => m.shipping_status === 2).length,
            inserted_messages: messageResult.insertedCount
          }
        };
      } catch (processingError) {
        // Revert status on error
        await this.repository.updateStatus(id, 0);
        throw processingError;
      }
    } catch (error) {
      console.error('Error in CampaignService.processCampaign:', error);
      return {
        success: false,
        error: 'Failed to process campaign',
        details: error.message
      };
    }
  }
}

module.exports = CampaignService; 