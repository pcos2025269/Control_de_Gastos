/**
 * Panel del usuario normal.
 *
 * Es un "espacio reservado" deliberadamente simple: su unico proposito en
 * esta fase es demostrar que un usuario con rol "user" puede acceder a su
 * propio recurso protegido. Aqui es donde, en fases futuras, se montara la
 * funcionalidad real de negocio dirigida a usuarios normales, sin tener
 * que tocar nada de la infraestructura de autenticacion.
 */

import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent implements OnInit {
  readonly welcomeMessage = signal<string>('Cargando...');

  constructor(private readonly dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getUserDashboard().subscribe({
      next: (response) => this.welcomeMessage.set(response.message),
      error: () =>
        this.welcomeMessage.set('No fue posible cargar tu panel.'),
    });
  }
}
