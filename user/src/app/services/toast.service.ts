import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface ToastOptions {
  timeOut?: number;
  closeButton?: boolean;
  progressBar?: boolean;
  enableHtml?: boolean;
  tapToDismiss?: boolean;
  positionClass?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  constructor(private toastr: ToastrService) {}

  /**
   * 🎉 Show success toast with celebration icon
   */
  success(message: string, title: string = '¡Éxito!', options?: ToastOptions): void {
    const finalMessage = this.addIcon(message, '🎉');
    this.toastr.success(finalMessage, title, {
      timeOut: 4000,
      closeButton: true,
      progressBar: true,
      enableHtml: true,
      ...options
    });
  }

  /**
   * ❌ Show error toast with error icon
   */
  error(message: string, title: string = 'Error', options?: ToastOptions): void {
    const finalMessage = this.addIcon(message, '❌');
    this.toastr.error(finalMessage, title, {
      timeOut: 6000,
      closeButton: true,
      progressBar: true,
      enableHtml: true,
      ...options
    });
  }

  /**
   * ⚠️ Show warning toast with warning icon
   */
  warning(message: string, title: string = 'Advertencia', options?: ToastOptions): void {
    const finalMessage = this.addIcon(message, '⚠️');
    this.toastr.warning(finalMessage, title, {
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
      enableHtml: true,
      ...options
    });
  }

  /**
   * ℹ️ Show info toast with info icon
   */
  info(message: string, title: string = 'Información', options?: ToastOptions): void {
    const finalMessage = this.addIcon(message, 'ℹ️');
    this.toastr.info(finalMessage, title, {
      timeOut: 4000,
      closeButton: true,
      progressBar: true,
      enableHtml: true,
      ...options
    });
  }

  /**
   * 🚀 Show campaign related success toast
   */
  campaignSuccess(action: string, campaignName?: string): void {
    const message = campaignName 
      ? `Campaña "<strong>${campaignName}</strong>" ${action} exitosamente`
      : `Campaña ${action} exitosamente`;
    this.success(message, '¡Campaña Actualizada!');
  }

  /**
   * 📱 Show message related success toast
   */
  messageSuccess(action: string, count?: number): void {
    const message = count 
      ? `${count} mensaje${count > 1 ? 's' : ''} ${action} exitosamente`
      : `Mensaje ${action} exitosamente`;
    this.success(message, '¡Mensajes Procesados!');
  }

  /**
   * 💾 Show save success toast
   */
  saveSuccess(item: string = 'elemento'): void {
    this.success(`El ${item} se ha guardado correctamente`, '¡Guardado!');
  }

  /**
   * 🗑️ Show delete success toast
   */
  deleteSuccess(item: string = 'elemento'): void {
    this.success(`El ${item} se ha eliminado correctamente`, '¡Eliminado!');
  }

  /**
   * 🔄 Show loading toast that can be updated
   */
  loading(message: string = 'Procesando...', title: string = 'Cargando'): void {
    const finalMessage = this.addIcon(message, '⏳');
    this.toastr.info(finalMessage, title, {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: false,
      progressBar: false,
      tapToDismiss: false,
      enableHtml: true
    });
  }

  /**
   * 📊 Show progress toast with percentage
   */
  progress(percentage: number, message: string = 'Progreso', title: string = 'Procesando'): void {
    const progressBar = this.createProgressBar(percentage);
    const finalMessage = `
      <div style="margin-bottom: 8px;">${message}</div>
      ${progressBar}
      <div style="text-align: center; font-size: 0.8rem; margin-top: 4px;">${percentage}%</div>
    `;
    
    this.toastr.info(finalMessage, title, {
      timeOut: 0,
      extendedTimeOut: 0,
      closeButton: false,
      progressBar: false,
      tapToDismiss: false,
      enableHtml: true
    });
  }

  /**
   * 🔐 Show authentication related toasts
   */
  authSuccess(action: string = 'autenticado'): void {
    this.success(`Usuario ${action} correctamente`, '¡Bienvenido!');
  }

  authError(message: string = 'Error de autenticación'): void {
    this.error(message, 'Error de Acceso');
  }

  /**
   * 🌐 Show network related errors
   */
  networkError(): void {
    this.error(
      'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      'Error de Conexión'
    );
  }

  /**
   * 📝 Show validation error
   */
  validationError(message: string = 'Por favor, revisa los datos ingresados'): void {
    this.warning(message, 'Datos Incompletos');
  }

  /**
   * 🎯 Show custom toast with specific styling
   */
  custom(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    title: string,
    icon?: string,
    options?: ToastOptions
  ): void {
    const finalMessage = icon ? this.addIcon(message, icon) : message;
    
    switch (type) {
      case 'success':
        this.toastr.success(finalMessage, title, options);
        break;
      case 'error':
        this.toastr.error(finalMessage, title, options);
        break;
      case 'warning':
        this.toastr.warning(finalMessage, title, options);
        break;
      case 'info':
        this.toastr.info(finalMessage, title, options);
        break;
    }
  }

  /**
   * Clear all toasts
   */
  clear(): void {
    this.toastr.clear();
  }

  /**
   * Remove specific toast by id
   */
  remove(toastId: number): void {
    this.toastr.remove(toastId);
  }

  /**
   * Private helper to add icons to messages
   */
  private addIcon(message: string, icon: string): string {
    return `<span style="margin-right: 8px; font-size: 1.1em;">${icon}</span>${message}`;
  }

  /**
   * Private helper to create progress bar HTML
   */
  private createProgressBar(percentage: number): string {
    const width = Math.min(Math.max(percentage, 0), 100);
    return `
      <div style="
        width: 100%;
        height: 8px;
        background-color: rgba(255, 255, 255, 0.3);
        border-radius: 4px;
        overflow: hidden;
        margin: 4px 0;
      ">
        <div style="
          width: ${width}%;
          height: 100%;
          background: linear-gradient(90deg, #4caf50, #81c784);
          border-radius: 4px;
          transition: width 0.3s ease;
        "></div>
      </div>
    `;
  }
} 