/**
 * Modelos de dominio para el frontend.
 *
 * Se replican aqui, del lado del cliente, los mismos conceptos que existen
 * en el backend (User, Role) para que el compilador de TypeScript pueda
 * detectar en tiempo de compilacion si un componente intenta leer un campo
 * que la API no envia, en vez de descubrirlo en tiempo de ejecucion.
 */

export type UserRole = 'admin' | 'user';

export interface PublicUser {
  id: number;
  username: string;
  role: UserRole;
  created_at: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: PublicUser;
}
