/**
 * RoleGuard.
 *
 * A diferencia de authGuard (que solo pregunta "hay sesion?"), este guard
 * pregunta "el usuario logueado tiene uno de los roles permitidos para
 * esta ruta?". Se implementa como una factory de guard (una funcion que
 * devuelve un CanActivateFn) para poder parametrizarlo distinto por ruta:
 *
 *   { path: 'admin', canActivate: [authGuard, roleGuard(['admin'])] }
 *
 * Igual que authGuard, esto es una conveniencia de UI (evita navegar a una
 * pantalla para la que el usuario no tiene permisos); la autorizacion real
 * la impone siempre el middleware requireRole del backend.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export function roleGuard(allowedRoles: UserRole[]): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    // Si esta autenticado pero con el rol incorrecto, se le manda a su
    // propio panel en vez de al login, ya que su sesion si es valida.
    router.navigate(user ? ['/user'] : ['/login']);
    return false;
  };
}
