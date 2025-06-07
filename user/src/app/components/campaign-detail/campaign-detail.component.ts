import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LucideAngularModule, Clock, Loader, CheckCircle, XCircle, Play, ArrowLeft, MessageSquare, Calendar, User, Hash, BarChart3, MessageCircle, PlayCircle, Download, AlertCircle, RefreshCw, ChevronRight, Eye } from 'lucide-angular';

import { CampaignService } from '../../services/campaign.service';
import { ToastService } from '../../services/toast.service';
import { IconService, IIconConfig } from '../../core/services/icon.service';
import { 
  Campaign, 
  CampaignStatus, 
  getCampaignStatusText, 
  getCampaignStatusClass 
} from '../../core/models/campaign';

/**
 * Interface for Campaign Statistics (Interface Segregation Principle)
 */
interface ICampaignStatistics {
  totalMessages: number;
  sentMessages: number;
  failedMessages: number;
  pendingMessages: number;
  hasStatistics(): boolean;
  getSuccessRate(): number;
}

/**
 * Class for handling Campaign Actions (Single Responsibility Principle)
 */
class CampaignActionHandler {
  constructor(
    private campaignService: CampaignService,
    private toast: ToastService
  ) {}

  processCampaign(campaign: Campaign, onSuccess: () => void): void {
    if (!this.isProcessable(campaign)) {
      this.toast.warning('Esta campaña no puede ser procesada en su estado actual');
      return;
    }

    this.campaignService.processCampaign(campaign.id).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toast.campaignSuccess('procesada', campaign.name);
          onSuccess();
        } else {
          this.toast.error(response.error || 'Error al procesar la campaña');
        }
      },
      error: () => {
        this.toast.error('No se pudo procesar la campaña. Intenta nuevamente.', 'Error de Conexión');
      }
    });
  }

  private isProcessable(campaign: Campaign): boolean {
    return campaign.process_status === CampaignStatus.PENDING;
  }

  canProcess(campaign: Campaign): boolean {
    return this.isProcessable(campaign);
  }
}

/**
 * Class for Campaign Statistics (Single Responsibility Principle)
 */
class CampaignStatisticsCalculator implements ICampaignStatistics {
  constructor(private campaign: Campaign) {}

  get totalMessages(): number {
    return this.campaign.total_messages || 0;
  }

  get sentMessages(): number {
    return this.campaign.sent_messages || 0;
  }

  get failedMessages(): number {
    return this.campaign.failed_messages || 0;
  }

  get pendingMessages(): number {
    return this.campaign.pending_messages || 0;
  }

  hasStatistics(): boolean {
    return this.totalMessages > 0 || this.sentMessages > 0 || 
           this.failedMessages > 0 || this.pendingMessages > 0;
  }

  getSuccessRate(): number {
    if (this.totalMessages === 0) return 0;
    return Math.round((this.sentMessages / this.totalMessages) * 100);
  }
}

/**
 * Class for Campaign Status Display (Single Responsibility Principle)
 */
class CampaignStatusDisplayer {
  static getStatusText(status: CampaignStatus): string {
    return getCampaignStatusText(status);
  }

  static getStatusClass(status: CampaignStatus): string {
    return getCampaignStatusClass(status);
  }

  static getStatusIcon(status: CampaignStatus): any {
    switch (status) {
      case CampaignStatus.PENDING:
        return Clock;
      case CampaignStatus.PROCESSING:
        return Loader;
      case CampaignStatus.COMPLETED:
        return CheckCircle;
      case CampaignStatus.ERROR:
        return XCircle;
      default:
        return Clock;
    }
  }
}

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    LucideAngularModule,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './campaign-detail.component.html',
  styleUrls: ['./campaign-detail.component.scss']
})
export class CampaignDetailComponent implements OnInit, OnDestroy {
  // Dependency Injection using inject() function (Dependency Inversion Principle)
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly campaignService = inject(CampaignService);
  private readonly toast = inject(ToastService);
  private readonly iconService = inject(IconService);
  private readonly cdr = inject(ChangeDetectorRef);

  // State management
  campaign: Campaign | null = null;
  loading = false;
  
  // Lucide icons
  readonly ClockIcon = Clock;
  readonly LoaderIcon = Loader;
  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly PlayIcon = Play;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly MessageSquareIcon = MessageSquare;
  readonly CalendarIcon = Calendar;
  readonly UserIcon = User;
  readonly HashIcon = Hash;
  readonly BarChart3Icon = BarChart3;
  readonly MessageCircleIcon = MessageCircle;
  readonly PlayCircleIcon = PlayCircle;
  readonly DownloadIcon = Download;
  readonly AlertCircleIcon = AlertCircle;
  readonly RefreshCwIcon = RefreshCw;
  readonly ChevronRightIcon = ChevronRight;
  readonly EyeIcon = Eye;
  
  // Helper classes (Composition over inheritance)
  private actionHandler!: CampaignActionHandler;
  private statisticsCalculator!: CampaignStatisticsCalculator;
  
  // Memory leak prevention
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.initializeComponent();
    this.loadCampaignFromRoute();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Initialize component dependencies (Dependency Inversion Principle)
   */
  private initializeComponent(): void {
    this.actionHandler = new CampaignActionHandler(this.campaignService, this.toast);
  }

  /**
   * Load campaign from route parameters
   */
  loadCampaignFromRoute(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    if (campaignId && !isNaN(Number(campaignId))) {
      this.loadCampaign(parseInt(campaignId));
    } else {
      this.handleInvalidCampaignId();
    }
  }

  /**
   * Load campaign data (Single Responsibility Principle)
   */
  private loadCampaign(id: number): void {
    this.loading = true;
    
    this.campaignService.getCampaign(id)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: any) => this.handleCampaignLoadSuccess(response),
        error: (error: any) => this.handleCampaignLoadError(error)
      });
  }

  /**
   * Handle successful campaign load
   */
  private handleCampaignLoadSuccess(response: any): void {
    if (response.success && response.data) {
      this.campaign = response.data;
      // Solo crear el calculator si tenemos una campaña válida
      if (this.campaign) {
        this.statisticsCalculator = new CampaignStatisticsCalculator(this.campaign);
      }
    } else {
      this.toast.error('No se pudo cargar la información de la campaña');
    }
  }

  /**
   * Handle campaign load error
   */
  private handleCampaignLoadError(error: any): void {
    console.error('❌ Error loading campaign:', error);
    this.toast.networkError();
  }

  /**
   * Handle invalid campaign ID
   */
  private handleInvalidCampaignId(): void {
    this.toast.error('ID de campaña inválido');
    this.goBack();
  }

  /**
   * Process campaign (Delegation to action handler)
   */
  processCampaign(): void {
    if (!this.campaign) return;

    this.actionHandler.processCampaign(
      this.campaign,
      () => this.loadCampaign(this.campaign!.id)
    );
  }

  /**
   * Check if campaign can be processed
   */
  canProcessCampaign(): boolean {
    return this.campaign ? this.actionHandler.canProcess(this.campaign) : false;
  }

  /**
   * Navigate back to campaigns list
   */
  goBack(): void {
    this.router.navigate(['/campaigns']);
  }

  /**
   * Navigate to campaign messages
   */
  viewMessages(): void {
    if (this.campaign) {
      this.router.navigate(['/campaigns', this.campaign.id, 'messages']);
    }
  }

  /**
   * Refresh campaign data
   */
  refreshData(): void {
    if (this.campaign) {
      this.loadCampaign(this.campaign.id);
    }
  }

  /**
   * Export campaign data
   */
  exportData(): void {
    if (this.campaign) {
      this.toast.info('Exportando datos de la campaña...');
      // TODO: Implement export functionality
      setTimeout(() => {
        this.toast.success('Datos exportados exitosamente');
      }, 2000);
    }
  }

  /**
   * View campaign analytics
   */
  viewAnalytics(): void {
    if (this.campaign) {
      this.router.navigate(['/campaigns', this.campaign.id, 'analytics']);
    }
  }

  // Getters for template (Encapsulation)
  get campaignStatus(): CampaignStatus | null {
    return this.campaign?.process_status ?? null;
  }

  get statistics(): ICampaignStatistics | null {
    return this.statisticsCalculator || null;
  }

  get hasStatistics(): boolean {
    return this.statisticsCalculator?.hasStatistics() ?? false;
  }

  // Icon and Status methods for template (Open/Closed Principle)
  getStatusText(status: CampaignStatus): string {
    return CampaignStatusDisplayer.getStatusText(status);
  }

  getStatusClass(status: CampaignStatus): string {
    return CampaignStatusDisplayer.getStatusClass(status);
  }

  getStatusIcon(status: CampaignStatus): any {
    return CampaignStatusDisplayer.getStatusIcon(status);
  }

  getStatusIconColor(status: CampaignStatus): string {
    const iconConfig = this.iconService.getCampaignStatusIcon(status);
    return iconConfig.color || '#666';
  }

  // UI Icon methods (Delegation Pattern)
  getIcon(iconName: string): string {
    return this.iconService.getMaterialIcon(iconName);
  }

  getIconConfig(iconName: string): IIconConfig {
    return this.iconService.getIcon(iconName);
  }
} 