import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { 
  LucideAngularModule, 
  AlertTriangle, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  X, 
  Check, 
  Zap, 
  Trash2 
} from 'lucide-angular';

export type DialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  type?: DialogType;
  confirmText?: string;
  cancelText?: string;
  icon?: string;
  showIcon?: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    LucideAngularModule
  ],
  templateUrl: './confirmation-dialog.html',
  styleUrl: './confirmation-dialog.scss'
})
export class ConfirmationDialog {
  @Input() data: ConfirmationDialogData = {
    title: 'Confirmar acción',
    message: '¿Estás seguro de que quieres continuar?',
    type: 'info',
    confirmText: 'Confirmar',
    cancelText: 'Cancelar',
    showIcon: true
  };

  @Input() isOpen = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  // Lucide icons
  readonly AlertTriangleIcon = AlertTriangle;
  readonly AlertCircleIcon = AlertCircle;
  readonly CheckCircleIcon = CheckCircle;
  readonly HelpCircleIcon = HelpCircle;
  readonly XIcon = X;
  readonly CheckIcon = Check;
  readonly ZapIcon = Zap;
  readonly Trash2Icon = Trash2;

  onConfirm(): void {
    this.confirm.emit();
    this.close.emit();
  }

  onCancel(): void {
    this.cancel.emit();
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }

  getDialogIcon(): any {
    switch (this.data.type) {
      case 'danger': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'success': return CheckCircle;
      default: return HelpCircle;
    }
  }

  getIconClasses(): string {
    switch (this.data.type) {
      case 'danger': return 'text-red-400';
      case 'warning': return 'text-yellow-400';
      case 'success': return 'text-green-400';
      default: return 'text-blue-400';
    }
  }

  getConfirmIcon(): any {
    switch (this.data.type) {
      case 'danger': return Trash2;
      case 'warning': return Zap;
      case 'success': return Check;
      default: return Check;
    }
  }

  getConfirmButtonClasses(): string {
    const baseClasses = 'text-white font-bold shadow-lg';
    
    switch (this.data.type) {
      case 'danger':
        return `${baseClasses} bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-red-500/25 hover:shadow-red-500/40 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 shadow-yellow-500/25 hover:shadow-yellow-500/40 focus:ring-yellow-500`;
      case 'success':
        return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 shadow-green-500/25 hover:shadow-green-500/40 focus:ring-green-500`;
      default:
        return `${baseClasses} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:shadow-blue-500/40 focus:ring-blue-500`;
    }
  }

  get dialogIcon(): string {
    if (this.data.icon) return this.data.icon;
    
    switch (this.data.type) {
      case 'danger': return 'warning';
      case 'warning': return 'warning_amber';
      case 'success': return 'check_circle';
      default: return 'help';
    }
  }

  get iconClasses(): string {
    switch (this.data.type) {
      case 'danger': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'success': return 'text-green-500';
      default: return 'text-blue-500';
    }
  }

  get confirmButtonClasses(): string {
    const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-all duration-200';
    
    switch (this.data.type) {
      case 'danger':
        return `${baseClasses} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
      case 'warning':
        return `${baseClasses} bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500`;
      case 'success':
        return `${baseClasses} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`;
      default:
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
    }
  }
}
