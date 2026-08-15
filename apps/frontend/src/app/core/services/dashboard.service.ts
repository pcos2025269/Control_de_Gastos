/**
 * Servicio de dashboards.
 *
 * Consume las rutas protegidas de ejemplo del backend
 * (/user/dashboard y /admin/dashboard). Existe principalmente para
 * demostrar, de punta a punta, que el interceptor adjunta el token
 * correctamente y que el backend responde distinto segun el rol. Cuando
 * se implemente la funcionalidad real del negocio, este archivo se
 * reemplaza por los servicios de dominio correspondientes, siguiendo el
 * mismo patron (inyectar HttpClient, usar environment.apiUrl).
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

interface DashboardResponse {
  message: string;
  role?: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private readonly http: HttpClient) {}

  getUserDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${environment.apiUrl}/user/dashboard`
    );
  }

  getAdminDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(
      `${environment.apiUrl}/admin/dashboard`
    );
  }
}
