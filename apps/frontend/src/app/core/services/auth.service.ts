/**
 * Servicio de autenticacion.
 *
 * Es la unica pieza del frontend que sabe donde y como se guarda el token
 * (localStorage) y cual es el estado de sesion actual. El resto de la
 * aplicacion (guards, interceptor, componentes) consume este servicio en
 * vez de tocar localStorage directamente, para que si en el futuro se
 * decide migrar a cookies httpOnly, el cambio quede contenido aqui.
 *
 * El estado de sesion se expone como una signal ("currentUser") en vez de
 * un simple campo publico, porque las signals permiten que los componentes
 * (por ejemplo una barra de navegacion) reaccionen automaticamente cuando
 * el usuario inicia o cierra sesion, sin necesidad de subscribirse
 * manualmente a un Observable.
 */

import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse, PublicUser } from '../models/user.model';

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  /**
   * Signal de solo lectura hacia afuera (se expone como readonly mas abajo)
   * que refleja el usuario actualmente autenticado, o null si no hay
   * sesion activa. Se inicializa leyendo localStorage para que, si el
   * usuario recarga la pagina, la sesion "sobreviva" sin tener que volver
   * a loguearse.
   */
  private readonly currentUserSignal = signal<PublicUser | null>(
    this.readStoredUser()
  );

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  /**
   * Llama al endpoint de login del backend. Si la respuesta es exitosa,
   * persiste el token y el usuario, y actualiza la signal de estado. El
   * componente de login se limita a subscribirse y manejar el error de
   * UI (mostrar un mensaje); toda la logica de "que hacer con un login
   * exitoso" vive aqui para no duplicarla si en el futuro hay mas de un
   * punto de entrada (por ejemplo, un registro que loguea automaticamente).
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.persistSession(response.token, response.user);
        })
      );
  }

  /**
   * Cierra la sesion localmente. No es necesario avisar al backend porque
   * los JWT son "stateless": el servidor no guarda sesiones, simplemente
   * deja de existir un token valido en el cliente. Si en el futuro se
   * necesita invalidar tokens antes de su expiracion (por ejemplo, en un
   * "cerrar sesion en todos los dispositivos"), este es el lugar donde se
   * agregaria la llamada al backend correspondiente.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  hasRole(role: string): boolean {
    return this.currentUserSignal()?.role === role;
  }

  private persistSession(token: string, user: PublicUser): void {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    this.currentUserSignal.set(user);
  }

  private readStoredUser(): PublicUser | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as PublicUser;
    } catch {
      // Si el contenido guardado esta corrupto, se descarta en vez de
      // romper el arranque de la aplicacion.
      return null;
    }
  }
}
