/**
 * Interceptor de autenticacion.
 *
 * Se implementa como un interceptor funcional (el estilo introducido en
 * Angular 15+) en vez de una clase con HttpInterceptor, porque es el
 * enfoque recomendado actualmente y se registra de forma mas simple en
 * app.config.ts mediante provideHttpClient(withInterceptors([...])).
 *
 * Su responsabilidad es unica y muy acotada: si existe un token guardado,
 * clonar la peticion saliente agregando la cabecera Authorization. Los
 * componentes y servicios de negocio nunca necesitan preocuparse por
 * adjuntar el token manualmente en cada llamada HTTP.
 *
 * Tambien centraliza la reaccion ante un 401: si el backend responde que
 * el token ya no es valido, se cierra la sesion local y se redirige al
 * login, evitando que cada servicio tenga que manejar ese caso por su
 * cuenta.
 */

import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  const authorizedReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authorizedReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
