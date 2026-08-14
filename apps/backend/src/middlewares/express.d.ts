/**
 * Ampliacion de los tipos de Express.
 *
 * Express no sabe, por defecto, que el middleware de autenticacion agrega
 * una propiedad "user" al objeto Request. Esta declaracion global extiende
 * la interfaz Request para que el resto del codigo pueda usar req.user con
 * seguridad de tipos, en vez de recurrir a "any".
 */

import { JwtPayload } from "../utils/jwt.util";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export {};
