import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LucideAngularModule, Megaphone, Plus, CheckCircle, Clock, MessageSquare, X, Search, Eye, Play, ArrowLeft, ArrowRight, Inbox, Home, ChevronRight, Check, RefreshCw, BarChart3, Filter, List } from 'lucide-angular';
import { ConfirmationDialog, ConfirmationDialogData } from '../../shared/components/confirmation-dialog/confirmation-dialog';

import { CampaignService } from '../../services/campaign.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { 
  Campaign, 
  CampaignStatus, 
  getCampaignStatusText, 
  getCampaignStatusClass 
} from '../../core/models/campaign';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    LucideAngularModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    ConfirmationDialog
  ],
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss']
})
export class CampaignListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  campaigns: Campaign[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['id', 'name', 'username', 'process_date', 'total_messages', 'status', 'actions'];
  
  filterForm: FormGroup;
  loading = false;
  
  // Lucide icons
  readonly MegaphoneIcon = Megaphone;
  readonly PlusIcon = Plus;
  readonly CheckCircleIcon = CheckCircle;
  readonly ClockIcon = Clock;
  readonly MessageSquareIcon = MessageSquare;
  readonly XIcon = X;
  readonly SearchIcon = Search;
  readonly EyeIcon = Eye;
  readonly PlayIcon = Play;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly ArrowRightIcon = ArrowRight;
  readonly InboxIcon = Inbox;
  readonly HomeIcon = Home;
  readonly ChevronRightIcon = ChevronRight;
  readonly CheckIcon = Check;
  readonly RefreshCwIcon = RefreshCw;
  readonly BarChart3Icon = BarChart3;
  readonly FilterIcon = Filter;
  readonly ListIcon = List;
  
  // Paginación
  totalCampaigns = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;

  // Epic Confirmation Dialog
  showConfirmDialog = false;
  confirmDialogData: ConfirmationDialogData = {
    title: '',
    message: '',
    type: 'warning',
    confirmText: 'Procesar',
    cancelText: 'Cancelar',
    showIcon: true
  };
  pendingCampaign: Campaign | null = null;

  constructor(
    private campaignService: CampaignService,
    private userService: UserService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private toast: ToastService,
    public router: Router
  ) {
    this.filterForm = this.fb.group({
      start_date: [''],
      end_date: [''],
      user_id: [''],
      status: ['']
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCampaigns();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        if (response.success && response.data) {
          // El API devuelve { users: [], pagination: {} }
          if (response.data.users && Array.isArray(response.data.users)) {
            this.users = response.data.users;
          } else if (Array.isArray(response.data)) {
            // Fallback en caso de que la estructura sea diferente
            this.users = response.data;
          } else {
            console.error('❌ Invalid users response structure:', response);
            this.users = [];
            this.toast.warning('No se pudieron cargar los usuarios correctamente');
          }
        } else {
          console.error('❌ Invalid users response:', response);
          this.users = [];
          this.toast.warning('No se pudieron cargar los usuarios correctamente');
        }
      },
      error: (error: any) => {
        console.error('❌ Error loading users:', error);
        this.users = [];
        this.toast.networkError();
      }
    });
  }

  loadCampaigns(): void {
    this.loading = true;
    const filters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.pageSize
    };

    // Formatear fechas
    if (filters.start_date) {
      filters.start_date = this.formatDate(filters.start_date);
    }
    if (filters.end_date) {
      filters.end_date = this.formatDate(filters.end_date);
    }

    this.campaignService.getCampaigns(filters).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.success && response.data && response.data.campaigns) {
          // Asegurar que campaigns es siempre un array
          this.campaigns = Array.isArray(response.data.campaigns) ? response.data.campaigns : [];
          this.totalCampaigns = response.data.pagination?.total || 0;
          this.totalPages = Math.ceil(this.totalCampaigns / this.pageSize);
          
          // Forzar detección de cambios
          this.cdr.detectChanges();
        } else {
          console.error('❌ Invalid response structure:', response);
          this.campaigns = [];
          this.totalCampaigns = 0;
          this.totalPages = 0;
          this.cdr.detectChanges();
          this.toast.warning('No se encontraron campañas válidas');
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('❌ Error loading campaigns:', error);
        this.campaigns = [];
        this.totalCampaigns = 0;
        this.totalPages = 0;
        this.toast.error('No se pudieron cargar las campañas. Intenta nuevamente.', 'Error de Conexión');
      }
    });
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadCampaigns();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadCampaigns();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadCampaigns();
  }

  // New pagination methods for Tailwind template
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadCampaigns();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadCampaigns();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadCampaigns();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalCampaigns / this.pageSize);
    this.loadCampaigns();
  }

  getStartIndex(): number {
    return ((this.currentPage - 1) * this.pageSize) + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalCampaigns ? this.totalCampaigns : end;
  }

  trackByCampaignId(index: number, campaign: Campaign): number {
    return campaign.id;
  }

  processCampaign(campaign: Campaign): void {
    this.pendingCampaign = campaign;
    this.confirmDialogData = {
      title: 'Procesar Campaña',
      message: `¿Está seguro de que desea procesar la campaña "${campaign.name}"? Esta acción enviará todos los mensajes programados.`,
      type: 'warning',
      confirmText: 'Procesar Campaña',
      cancelText: 'Cancelar',
      showIcon: true
    };
    this.showConfirmDialog = true;
  }

  onConfirmProcessCampaign(): void {
    if (this.pendingCampaign) {
      this.campaignService.processCampaign(this.pendingCampaign.id).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toast.campaignSuccess('procesada', this.pendingCampaign!.name);
            this.loadCampaigns();
          } else {
            this.toast.error(`Error al procesar la campaña: ${response.error || 'Error desconocido'}`, 'Error de Procesamiento');
          }
          this.closeConfirmDialog();
        },
        error: (error: any) => {
          console.error('Error processing campaign:', error);
          this.toast.error(`No se pudo procesar la campaña "${this.pendingCampaign!.name}"`, 'Error de Procesamiento');
          this.closeConfirmDialog();
        }
      });
    } else {
      this.closeConfirmDialog();
    }
  }

  onCancelProcessCampaign(): void {
    this.closeConfirmDialog();
  }

  closeConfirmDialog(): void {
    this.showConfirmDialog = false;
    this.pendingCampaign = null;
  }

  getCampaignStatusText(status: CampaignStatus): string {
    return getCampaignStatusText(status);
  }

  getCampaignStatusClass(status: CampaignStatus): string {
    // Update status classes for Tailwind
    switch (status) {
      case 0: // Pendiente
        return 'bg-yellow-100 text-yellow-800';
      case 1: // Procesando
        return 'bg-blue-100 text-blue-800';
      case 2: // Completada
        return 'bg-green-100 text-green-800';
      case 3: // Error
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    
    // Si ya es string (input type="date"), devolverlo tal como está
    if (typeof date === 'string') {
      return date;
    }
    
    // Si es objeto Date, convertirlo a string
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    
    return '';
  }

  // Statistics methods
  getCompletedCampaigns(): number {
    return this.campaigns.filter(campaign => campaign.process_status === 2).length;
  }

  getProcessingCampaigns(): number {
    return this.campaigns.filter(campaign => campaign.process_status === 1).length;
  }

  getPendingCampaigns(): number {
    return this.campaigns.filter(campaign => campaign.process_status === 0).length;
  }

  getErrorCampaigns(): number {
    return this.campaigns.filter(campaign => campaign.process_status === 3).length;
  }

  getTotalMessages(): number {
    return this.campaigns.reduce((total, campaign) => {
      return total + (campaign.total_messages || 0);
    }, 0);
  }

  // Percentage methods for progress bars
  getCompletedPercentage(): number {
    if (this.campaigns.length === 0) return 0;
    return (this.getCompletedCampaigns() / this.campaigns.length) * 100;
  }

  getProcessingPercentage(): number {
    if (this.campaigns.length === 0) return 0;
    return (this.getProcessingCampaigns() / this.campaigns.length) * 100;
  }

  // Navigation methods
  viewCampaignDetails(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id]);
  }

  viewMessages(campaign: Campaign): void {
    this.router.navigate(['/campaigns', campaign.id, 'messages']);
  }

  createNewCampaign(): void {
    this.router.navigate(['/campaigns/new']);
  }

  // New method for refresh functionality
  refreshData(): void {
    this.toast.info('Actualizando datos...', 'Actualizar');
    this.loadUsers();
    this.loadCampaigns();
  }

  /**
   * View campaign details
   */
  viewCampaign(campaignId: number): void {
    this.router.navigate(['/campaigns', campaignId]);
  }
} 