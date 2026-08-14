/**
 * Rutas protegidas de ejemplo.
 *
 * Este archivo NO forma parte del negocio real de la aplicacion: existe
 * para demostrar y probar que requireAuth y requireRole funcionan de
 * extremo a extremo, y para servir de plantilla de como se protegeran las
 * rutas de negocio que se agreguen en fases futuras. Cuando se implemente
 * la funcionalidad principal, sus rutas deberan seguir el mismo patron:
 * requireAuth primero, y requireRole(...) despues si aplica.
 */

import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { requireRole } from "../middlewares/role.middleware";

export const protectedRoutes = Router();

// Accesible por cualquier usuario autenticado, sin importar su rol.
protectedRoutes.get("/user/dashboard", requireAuth, (req, res) => {
  res.status(200).json({
    message: `Bienvenido a tu panel, ${req.user?.username}`,
    role: req.user?.role,
  });
});

// Accesible unicamente por usuarios con rol "admin".
protectedRoutes.get(
  "/admin/dashboard",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.status(200).json({
      message: `Bienvenido al panel de administracion, ${req.user?.username}`,
    });
  }
);
