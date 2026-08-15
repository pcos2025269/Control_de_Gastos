/**
 * Configuracion raiz de la aplicacion (equivalente moderno al AppModule).
 *
 * Aqui se registran los providers globales. El mas relevante para esta
 * fase es provideHttpClient(withInterceptors([authInterceptor])): sin este
 * registro, el interceptor definido en core/interceptors nunca se
 * ejecutaria, y ninguna peticion llevaria el token JWT automaticamente.
 */

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
