/**
 * Middleware de autorizacion por rol.
 *
 * Se implementa como una "factory" (una funcion que devuelve un
 * middleware) en lugar de un middleware fijo, para poder reutilizarlo con
 * distintos roles permitidos segun la ruta: requireRole("admin"),
 * requireRole("admin", "user"), etc. Esto evita duplicar codigo por cada
 * combinacion de roles que surja a medida que crezca el sistema.
 *
 * Este middleware siempre debe usarse DESPUES de requireAuth, ya que
 * depende de que req.user ya haya sido poblado con el payload del token.
 */

import { NextFunction, Request, Response } from "express";
import { UserRole } from "../models/user.model";

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      // Si esto ocurre, es un error de configuracion de rutas (falta
      // requireAuth antes de requireRole), no una falla del usuario.
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: "No tienes permisos suficientes para acceder a este recurso",
      });
      return;
    }

    next();
  };
}
