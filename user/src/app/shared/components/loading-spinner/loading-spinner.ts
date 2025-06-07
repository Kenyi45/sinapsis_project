import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './loading-spinner.html',
  styleUrl: './loading-spinner.scss'
})
export class LoadingSpinner {
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() message: string = 'Cargando...';
  @Input() showMessage: boolean = true;
  @Input() fullScreen: boolean = false;
  @Input() overlay: boolean = false;

  get spinnerSize(): number {
    switch (this.size) {
      case 'small': return 24;
      case 'large': return 64;
      default: return 40;
    }
  }

  get containerClasses(): string {
    const base = 'flex flex-col items-center justify-center';
    
    if (this.fullScreen) {
      return `${base} fixed inset-0 z-50 bg-white`;
    }
    
    if (this.overlay) {
      return `${base} absolute inset-0 z-10 bg-white bg-opacity-90`;
    }
    
    return `${base} p-8`;
  }
}
