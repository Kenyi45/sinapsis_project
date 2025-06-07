import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  dismissible?: boolean;
  action?: {
    label: string;
    handler: () => void;
  };
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast implements OnInit {
  @Input() data: ToastData = {
    type: 'info',
    title: 'Notificación',
    message: '',
    duration: 5000,
    dismissible: true
  };
  
  @Output() dismiss = new EventEmitter<void>();
  @Output() actionClick = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.data.duration && this.data.duration > 0) {
      setTimeout(() => {
        this.onDismiss();
      }, this.data.duration);
    }
  }

  onDismiss(): void {
    this.dismiss.emit();
  }

  onActionClick(): void {
    if (this.data.action?.handler) {
      this.data.action.handler();
    }
    this.actionClick.emit();
  }

  get toastIcon(): string {
    switch (this.data.type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'info';
    }
  }

  get toastClasses(): string {
    const baseClasses = 'flex items-start p-4 mb-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out transform';
    
    switch (this.data.type) {
      case 'success':
        return `${baseClasses} bg-green-50 border-green-200 text-green-800`;
      case 'error':
        return `${baseClasses} bg-red-50 border-red-200 text-red-800`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-200 text-yellow-800`;
      default:
        return `${baseClasses} bg-blue-50 border-blue-200 text-blue-800`;
    }
  }

  get iconClasses(): string {
    switch (this.data.type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  }
}
