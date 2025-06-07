import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { 
  LucideAngularModule, 
  Plus, 
  Save, 
  Info, 
  ArrowLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Type,
  User as UserIcon,
  Calendar,
  Clock,
  MessageSquare,
  Users,
  Phone
} from 'lucide-angular';

import { CampaignService } from '../../services/campaign.service';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { User } from '../../core/models/user';

@Component({
  selector: 'app-campaign-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    LucideAngularModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss']
})
export class CampaignFormComponent implements OnInit {
  campaignForm: FormGroup;
  users: User[] = [];
  loading = false;
  submitting = false;
  minDate = new Date().toISOString().split('T')[0]; // Fecha mínima para input type="date"
  
  // Lucide icons
  readonly PlusIcon = Plus;
  readonly SaveIcon = Save;
  readonly InfoIcon = Info;
  readonly ArrowLeftIcon = ArrowLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly XIcon = X;
  readonly SparklesIcon = Sparkles;
  readonly TypeIcon = Type;
  readonly UserIcon = UserIcon;
  readonly CalendarIcon = Calendar;
  readonly ClockIcon = Clock;
  readonly MessageSquareIcon = MessageSquare;
  readonly UsersIcon = Users;
  readonly PhoneIcon = Phone;

  constructor(
    private fb: FormBuilder,
    private campaignService: CampaignService,
    private userService: UserService,
    private router: Router,
    private toast: ToastService
  ) {
    this.campaignForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      user_id: ['', Validators.required],
      process_date: ['', Validators.required],
      process_hour: ['', [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)]],
      message_text: ['', [Validators.required, Validators.minLength(10)]],
      phone_list: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (response: any) => {
        this.loading = false;
        console.log('✅ Users API response:', response);
        
        if (response.success && response.data) {
          // El API devuelve { users: [], pagination: {} }
          if (response.data.users && Array.isArray(response.data.users)) {
            this.users = response.data.users;
            console.log('✅ Loaded users:', this.users);
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
        this.loading = false;
        console.error('❌ Error loading users:', error);
        this.users = [];
        this.toast.networkError();
      }
    });
  }

  onSubmit(): void {
    if (this.campaignForm.valid && !this.submitting) {
      this.submitting = true;
      
      const formValue = this.campaignForm.value;
      
      // Procesar lista de teléfonos
      const phoneNumbers = this.processPhoneList(formValue.phone_list);
      
      if (phoneNumbers.length === 0) {
        this.submitting = false;
        this.toast.error('Debe ingresar al menos un número de teléfono válido', 'Lista de Teléfonos Inválida');
        return;
      }

      const campaignData = {
        name: formValue.name,
        user_id: parseInt(formValue.user_id),
        process_date: this.formatDate(formValue.process_date),
        process_hour: formValue.process_hour,
        message_text: formValue.message_text,
        phone_list: phoneNumbers
      };

      console.log('📤 Sending campaign data to API:', campaignData);

      this.campaignService.createCampaign(campaignData).subscribe({
        next: (response: any) => {
          this.submitting = false;
          console.log('✅ Campaign creation response:', response);
          if (response.success) {
            this.toast.campaignSuccess('creada', campaignData.name);
            this.router.navigate(['/campaigns']);
          } else {
            console.error('❌ Campaign creation failed:', response);
            this.toast.error(response.error || 'Error al crear la campaña', 'Error');
          }
        },
        error: (error: any) => {
          this.submitting = false;
          console.error('❌ Error creating campaign:', error);
          console.error('❌ Error details:', error.error);
          
          let errorMessage = 'No se pudo crear la campaña. Intenta nuevamente.';
          if (error.error && error.error.error) {
            errorMessage = error.error.error;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          this.toast.error(errorMessage, 'Error de Conexión');
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  processPhoneList(phoneListText: string): string[] {
    if (!phoneListText) return [];
    
    // Separar por comas, saltos de línea o punto y coma
    const phones = phoneListText
      .split(/[,;\n\r]+/)
      .map(phone => phone.trim())
      .filter(phone => phone.length > 0)
      .map(phone => {
        // Limpiar caracteres no numéricos excepto +
        let cleanPhone = phone.replace(/[^\d+]/g, '');
        
        // Si no empieza con +, agregar +51 para Perú
        if (!cleanPhone.startsWith('+')) {
          cleanPhone = '+51' + cleanPhone;
        }
        
        return cleanPhone;
      })
      .filter(phone => phone.length >= 10); // Filtrar números muy cortos
    
    return [...new Set(phones)]; // Eliminar duplicados
  }

  formatDate(date: Date | string): string {
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

  markFormGroupTouched(): void {
    Object.keys(this.campaignForm.controls).forEach(key => {
      const control = this.campaignForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/campaigns']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.campaignForm.get(fieldName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    switch (fieldName) {
      case 'name':
        if (control.errors['required']) return 'El nombre es requerido';
        if (control.errors['minlength']) return 'El nombre debe tener al menos 3 caracteres';
        break;
      case 'user_id':
        if (control.errors['required']) return 'Debe seleccionar un usuario';
        break;
      case 'process_date':
        if (control.errors['required']) return 'La fecha de procesamiento es requerida';
        break;
      case 'process_hour':
        if (control.errors['required']) return 'La hora de procesamiento es requerida';
        if (control.errors['pattern']) return 'Formato de hora inválido (HH:MM)';
        break;
      case 'message_text':
        if (control.errors['required']) return 'El mensaje es requerido';
        if (control.errors['minlength']) return 'El mensaje debe tener al menos 10 caracteres';
        break;
      case 'phone_list':
        if (control.errors['required']) return 'La lista de teléfonos es requerida';
        break;
    }
    
    return 'Campo inválido';
  }
}