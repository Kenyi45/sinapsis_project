import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  @Input() isOpen = false;
  @Input() currentUser: any = null;
  @Output() close = new EventEmitter<void>();

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard'
    },
    {
      label: 'Campañas',
      icon: 'campaign',
      route: '/campaigns',
      badge: 3
    },
    {
      label: 'Mensajes',
      icon: 'message',
      route: '/messages'
    },
    {
      label: 'Usuarios',
      icon: 'people',
      route: '/users'
    },
    {
      label: 'Reportes',
      icon: 'analytics',
      route: '/reports'
    },
    {
      label: 'Configuración',
      icon: 'settings',
      route: '/settings'
    }
  ];

  constructor(private router: Router) {}

  onClose(): void {
    this.close.emit();
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      this.onClose();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase();
  }
}
