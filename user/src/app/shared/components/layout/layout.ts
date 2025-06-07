import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Header } from '../header/header';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatIconModule,
    MatButtonModule,
    Header,
    Sidebar
  ],
  templateUrl: './layout.html',
  styleUrl: './layout.scss'
})
export class Layout implements OnInit {
  sidebarOpen = false;
  currentUser: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Get current user from localStorage or service
    this.currentUser = {
      name: 'Usuario Demo',
      email: 'demo@sinapsis.com',
      avatar: null
    };
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    // Clear authentication and redirect
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
