import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LucideAngularModule, MessageSquare, CheckCircle, XCircle, Clock, Filter, X, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowLeft, Home, Check, Download, RefreshCw } from 'lucide-angular';

import { MessageService } from '../../services/message.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-message-list',
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
    MatChipsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.scss']
})
export class MessageListComponent implements OnInit {
  messages: any[] = [];
  campaignId: number = 0;
  campaignName: string = '';
  loading = false;
  
  displayedColumns: string[] = ['id', 'phone', 'text', 'status', 'process_date'];
  totalMessages = 0;
  pageSize = 10;
  currentPage = 1;
  totalPages = 0;
  
  filterForm: FormGroup;
  
  // Lucide icons
  readonly MessageSquareIcon = MessageSquare;
  readonly CheckCircleIcon = CheckCircle;
  readonly XCircleIcon = XCircle;
  readonly ClockIcon = Clock;
  readonly FilterIcon = Filter;
  readonly XIcon = X;
  readonly SearchIcon = Search;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly ChevronsLeftIcon = ChevronsLeft;
  readonly ChevronsRightIcon = ChevronsRight;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly HomeIcon = Home;
  readonly CheckIcon = Check;
  readonly DownloadIcon = Download;
  readonly RefreshCwIcon = RefreshCw;
  
  statistics = {
    total_messages: 0,
    sent_messages: 0,
    failed_messages: 0,
    pending_messages: 0
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private toast: ToastService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      status: [''],
      phone: ['']
    });
  }

  ngOnInit(): void {
    const campaignId = this.route.snapshot.paramMap.get('id');
    if (campaignId) {
      this.campaignId = parseInt(campaignId);
      this.loadMessages();
    }
  }

  loadMessages(): void {
    this.loading = true;
    
    this.messageService.getCampaignMessages(this.campaignId, this.currentPage, this.pageSize).subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('📨 Full Backend response:', JSON.stringify(response, null, 2));
        
        if (response.success && response.data) {
          console.log('📨 Response data:', response.data);
          console.log('📨 Messages in response:', response.data.messages);
          
          this.messages = response.data.messages || [];
          this.campaignName = response.data.campaign?.name || '';
          this.totalMessages = response.data.pagination?.total || this.messages.length;
          this.totalPages = Math.ceil(this.totalMessages / this.pageSize);
          
          if (response.data.statistics) {
            this.statistics = response.data.statistics;
          } else {
            this.updateStatistics();
          }
          
          console.log('📨 Messages array after assignment:', this.messages);
          console.log('📨 Messages length:', this.messages.length);
          console.log('📨 First message:', this.messages[0]);
          
          if (this.messages.length > 0) {
            this.toast.success(`Se cargaron ${this.messages.length} mensajes`, 'Éxito');
          } else {
            this.toast.warning('No se encontraron mensajes en la respuesta');
          }
        } else {
          console.log('❌ Response not successful or no data:', response);
          this.messages = [];
          this.totalPages = 0;
          this.toast.warning('No se encontraron mensajes');
        }
      },
      error: (error: any) => {
        this.loading = false;
        console.error('❌ Error loading messages:', error);
        this.messages = [];
        this.totalPages = 0;
        this.toast.error('Error al cargar los mensajes', 'Error de Conexión');
      }
    });
  }

  updateStatistics(): void {
    this.statistics = {
      total_messages: this.messages.length,
      sent_messages: this.getSentMessages(),
      failed_messages: this.getFailedMessages(),
      pending_messages: this.getPendingMessages()
    };
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadMessages();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage = 1;
    this.loadMessages();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadMessages();
  }

  // New pagination methods for Tailwind template
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadMessages();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadMessages();
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadMessages();
    }
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
    this.totalPages = Math.ceil(this.totalMessages / this.pageSize);
    this.loadMessages();
  }

  getStartIndex(): number {
    return ((this.currentPage - 1) * this.pageSize) + 1;
  }

  getEndIndex(): number {
    const end = this.currentPage * this.pageSize;
    return end > this.totalMessages ? this.totalMessages : end;
  }

  trackByMessageId(index: number, message: any): number {
    return message.id;
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pendiente';
      case 1: return 'Enviado';
      case 2: return 'Fallido';
      case 3: return 'Entregado';
      default: return 'Desconocido';
    }
  }

  getStatusClass(status: number): string {
    // Update status classes for Tailwind
    switch (status) {
      case 0: return 'bg-yellow-100 text-yellow-800'; // Pendiente
      case 1: return 'bg-green-100 text-green-800';   // Enviado
      case 2: return 'bg-red-100 text-red-800';       // Fallido
      case 3: return 'bg-blue-100 text-blue-800';     // Entregado
      default: return 'bg-gray-100 text-gray-800';    // Desconocido
    }
  }

  getMessageStatusText(status: number): string {
    return this.getStatusText(status);
  }

  getMessageStatusClass(status: number): string {
    return this.getStatusClass(status);
  }

  goBack(): void {
    this.router.navigate(['/campaigns', this.campaignId]);
  }

  goToCampaigns(): void {
    this.router.navigate(['/campaigns']);
  }

  getSentMessages(): number {
    return this.messages.filter(message => message.shipping_status === 1 || message.shipping_status === 3).length;
  }

  getPendingMessages(): number {
    return this.messages.filter(message => message.shipping_status === 0).length;
  }

  getFailedMessages(): number {
    return this.messages.filter(message => message.shipping_status === 2).length;
  }

  // Percentage methods for progress bars
  getSentPercentage(): number {
    if (this.statistics.total_messages === 0) return 0;
    return (this.statistics.sent_messages / this.statistics.total_messages) * 100;
  }

  getFailedPercentage(): number {
    if (this.statistics.total_messages === 0) return 0;
    return (this.statistics.failed_messages / this.statistics.total_messages) * 100;
  }

  getPendingPercentage(): number {
    if (this.statistics.total_messages === 0) return 0;
    return (this.statistics.pending_messages / this.statistics.total_messages) * 100;
  }

  // New methods for enhanced functionality
  exportData(): void {
    this.toast.info('Preparando exportación de datos...', 'Exportar');
    // TODO: Implement data export functionality
    console.log('Exporting data for campaign:', this.campaignId);
  }

  refreshData(): void {
    this.toast.info('Actualizando datos...', 'Actualizar');
    this.loadMessages();
  }
} 