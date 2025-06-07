import { Injectable } from '@angular/core';
import { CampaignStatus } from '../models/campaign';

/**
 * Interface for Icon Configuration (Interface Segregation Principle)
 */
export interface IIconConfig {
  name: string;
  library: 'material' | 'mui';
  color?: string;
  size?: string;
}

/**
 * Icon Registry Service following Single Responsibility Principle
 * Manages icon mappings and provides abstraction over different icon libraries
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {
  
  /**
   * Campaign Status Icon Mapping (Open/Closed Principle)
   */
  private readonly campaignStatusIcons: Record<CampaignStatus, IIconConfig> = {
    [CampaignStatus.PENDING]: {
      name: 'schedule',
      library: 'material',
      color: '#1976d2'
    },
    [CampaignStatus.PROCESSING]: {
      name: 'sync',
      library: 'material', 
      color: '#ff9800'
    },
    [CampaignStatus.COMPLETED]: {
      name: 'check_circle',
      library: 'material',
      color: '#4caf50'
    },
    [CampaignStatus.ERROR]: {
      name: 'error',
      library: 'material',
      color: '#f44336'
    }
  };

  /**
   * General UI Icons Mapping
   */
  private readonly uiIcons: Record<string, IIconConfig> = {
    // Navigation
    'back': { name: 'arrow_back', library: 'material' },
    'next': { name: 'arrow_forward', library: 'material' },
    'home': { name: 'home', library: 'material' },
    'menu': { name: 'menu', library: 'material' },
    'close': { name: 'close', library: 'material' },
    
    // Actions
    'add': { name: 'add', library: 'material' },
    'edit': { name: 'edit', library: 'material' },
    'delete': { name: 'delete', library: 'material' },
    'save': { name: 'save', library: 'material' },
    'cancel': { name: 'cancel', library: 'material' },
    'refresh': { name: 'refresh', library: 'material' },
    'download': { name: 'download', library: 'material' },
    'upload': { name: 'upload', library: 'material' },
    'share': { name: 'share', library: 'material' },
    'print': { name: 'print', library: 'material' },
    
    // Content
    'campaign': { name: 'campaign', library: 'material' },
    'message': { name: 'message', library: 'material' },
    'phone': { name: 'phone', library: 'material' },
    'email': { name: 'email', library: 'material' },
    'user': { name: 'person', library: 'material' },
    'users': { name: 'group', library: 'material' },
    'settings': { name: 'settings', library: 'material' },
    'info': { name: 'info', library: 'material' },
    'help': { name: 'help', library: 'material' },
    'search': { name: 'search', library: 'material' },
    'filter': { name: 'filter_list', library: 'material' },
    'sort': { name: 'sort', library: 'material' },
    
    // Status & Feedback
    'success': { name: 'check_circle', library: 'material', color: '#4caf50' },
    'warning': { name: 'warning', library: 'material', color: '#ff9800' },
    'error': { name: 'error', library: 'material', color: '#f44336' },
    'loading': { name: 'sync', library: 'material', color: '#1976d2' },
    
    // Data & Analytics
    'analytics': { name: 'analytics', library: 'material' },
    'chart': { name: 'bar_chart', library: 'material' },
    'statistics': { name: 'assessment', library: 'material' },
    'dashboard': { name: 'dashboard', library: 'material' },
    
    // Time & Calendar
    'date': { name: 'event', library: 'material' },
    'time': { name: 'schedule', library: 'material' },
    'calendar': { name: 'calendar_today', library: 'material' },
    'history': { name: 'history', library: 'material' },
    
    // Communication
    'send': { name: 'send', library: 'material' },
    'inbox': { name: 'inbox', library: 'material' },
    'outbox': { name: 'outbox', library: 'material' },
    'draft': { name: 'drafts', library: 'material' },
    
    // File & Document
    'file': { name: 'description', library: 'material' },
    'folder': { name: 'folder', library: 'material' },
    'attachment': { name: 'attachment', library: 'material' },
    'link': { name: 'link', library: 'material' },
    
    // Visibility & Display
    'visibility': { name: 'visibility', library: 'material' },
    'visibility_off': { name: 'visibility_off', library: 'material' },
    'expand': { name: 'expand_more', library: 'material' },
    'collapse': { name: 'expand_less', library: 'material' },
    
    // Processing & Status
    'play': { name: 'play_arrow', library: 'material' },
    'pause': { name: 'pause', library: 'material' },
    'stop': { name: 'stop', library: 'material' },
    'process': { name: 'play_arrow', library: 'material' },
    
    // Notifications
    'notification': { name: 'notifications', library: 'material' },
    'notification_off': { name: 'notifications_off', library: 'material' },
    'bell': { name: 'notifications', library: 'material' },
    
    // Security & Permissions
    'lock': { name: 'lock', library: 'material' },
    'unlock': { name: 'lock_open', library: 'material' },
    'security': { name: 'security', library: 'material' },
    'verified': { name: 'verified', library: 'material' }
  };

  /**
   * Get icon configuration for campaign status (Dependency Inversion Principle)
   */
  getCampaignStatusIcon(status: CampaignStatus): IIconConfig {
    return this.campaignStatusIcons[status] || this.uiIcons['help'];
  }

  /**
   * Get icon configuration by name
   */
  getIcon(iconName: string): IIconConfig {
    return this.uiIcons[iconName] || { 
      name: iconName, 
      library: 'material' 
    };
  }

  /**
   * Get Material Design icon name
   */
  getMaterialIcon(iconName: string): string {
    const icon = this.getIcon(iconName);
    return icon.library === 'material' ? icon.name : iconName;
  }

  /**
   * Check if icon exists in registry
   */
  hasIcon(iconName: string): boolean {
    return iconName in this.uiIcons;
  }

  /**
   * Register custom icon (Open/Closed Principle - extensible)
   */
  registerIcon(key: string, config: IIconConfig): void {
    this.uiIcons[key] = config;
  }

  /**
   * Get all available icons
   */
  getAllIcons(): Record<string, IIconConfig> {
    return { ...this.uiIcons };
  }

  /**
   * Get icons by category
   */
  getIconsByCategory(category: 'navigation' | 'actions' | 'content' | 'status'): Record<string, IIconConfig> {
    const categories = {
      navigation: ['back', 'next', 'home', 'menu', 'close'],
      actions: ['add', 'edit', 'delete', 'save', 'cancel', 'refresh'],
      content: ['campaign', 'message', 'phone', 'email', 'user', 'users'],
      status: ['success', 'warning', 'error', 'loading']
    };

    const categoryKeys = categories[category] || [];
    const result: Record<string, IIconConfig> = {};
    
    categoryKeys.forEach(key => {
      if (this.uiIcons[key]) {
        result[key] = this.uiIcons[key];
      }
    });

    return result;
  }
} 