/**
 * Configuracion de rutas raiz.
 *
 * Se usa lazy loading (loadComponent) para cada feature en vez de
 * importarlas todas de forma estatica, de modo que el bundle inicial solo
 * incluya lo necesario para mostrar el login; el codigo de cada panel se
 * descarga bajo demanda, cuando el usuario navega a el. Esta estructura
 * tambien deja claro, con solo leer este archivo, que rutas existen y que
 * proteccion tiene cada una.
 */

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'user',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/user-dashboard/user-dashboard.component').then(
        (m) => m.UserDashboardComponent
      ),
  },

  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () =>
      import('./features/admin-dashboard/admin-dashboard.component').then(
        (m) => m.AdminDashboardComponent
      ),
  },

  { path: '**', redirectTo: 'login' },
];
