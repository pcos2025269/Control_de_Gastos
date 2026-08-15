/**
 * Panel de administracion.
 *
 * Solo alcanzable por usuarios con rol "admin" (impuesto por roleGuard en
 * el frontend y por requireRole('admin') en el backend). Igual que el
 * panel de usuario, es un espacio reservado para la funcionalidad
 * administrativa real que se construira sobre esta base de seguridad.
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  readonly welcomeMessage = signal<string>('Cargando...');

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getAdminDashboard().subscribe({
      next: (response) => this.welcomeMessage.set(response.message),
      error: () =>
        this.welcomeMessage.set(
          'No fue posible cargar el panel de administracion.'
        ),
    });
  }
}
