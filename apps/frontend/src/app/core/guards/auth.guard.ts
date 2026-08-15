/**
 * AuthGuard.
 *
 * Protege rutas que requieren una sesion activa. Se usa el estilo de guard
 * funcional (CanActivateFn), el recomendado desde Angular 15+, en lugar de
 * una clase que implemente CanActivate: es mas conciso y se integra mejor
 * con inject().
 *
 * Notese que este guard solo verifica la PRESENCIA de un token en el
 * cliente; no valida su firma ni su expiracion (eso lo hace el backend en
 * cada request, a traves del interceptor + middleware). Esto es
 * intencional: el guard es una capa de experiencia de usuario (evita
 * mostrar una pantalla protegida y luego fallar todas sus peticiones), no
 * la capa real de seguridad. La seguridad real siempre vive en el
 * servidor, porque cualquier verificacion que solo ocurra en el cliente
 * puede ser evadida por un usuario malicioso.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
