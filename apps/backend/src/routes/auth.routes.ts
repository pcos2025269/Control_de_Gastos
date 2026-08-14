/**
 * Rutas de autenticacion.
 *
 * Este archivo unicamente declara el mapeo URL -> controlador. No contiene
 * logica: eso vive en el controlador y, debajo de el, en el servicio.
 */

import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";

export const authRoutes = Router();

// Publica: cualquiera puede intentar iniciar sesion.
authRoutes.post("/login", authController.login);

// Protegida: requiere un token valido. Sirve para que el frontend
// verifique la sesion actual al recargar la aplicacion.
authRoutes.get("/me", requireAuth, authController.me);
