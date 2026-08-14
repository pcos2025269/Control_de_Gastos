/**
 * Router raiz de la API.
 *
 * Centraliza el montaje de los distintos modulos de rutas bajo sus
 * prefijos. A medida que se agreguen nuevos dominios de negocio (por
 * ejemplo /products, /orders), cada uno debera vivir en su propio archivo
 * de rutas y montarse aqui, manteniendo app.ts limpio de detalles de
 * enrutamiento.
 */

import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { protectedRoutes } from "./protected.routes";

export const apiRouter = Router();

apiRouter.use("/auth", authRoutes);
apiRouter.use("/", protectedRoutes);
