/**
 * Barra de navegacion compartida.
 *
 * Se ubica en shared/ porque no pertenece a un feature especifico: la usan
 * tanto el panel de admin como el de usuario. Muestra el username y rol
 * actuales leyendo la signal currentUser de AuthService, y se actualiza
 * automaticamente si esa signal cambia (por ejemplo, al cerrar sesion).
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser = this.authService.currentUser;

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
