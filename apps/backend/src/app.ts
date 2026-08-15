/**
 * Configuracion de la aplicacion Express.
 *
 * Se separa la construccion de la app (este archivo) de su arranque
 * (server.ts) para poder importar "app" desde pruebas de integracion sin
 * necesidad de levantar un socket real escuchando en un puerto.
 */

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import { apiRouter } from "./routes";

export const app = express();

// CORS restringido al origen del frontend Angular, en vez de "*", porque
// las peticiones llevan el token JWT en la cabecera Authorization y no
// conviene aceptar ese trafico desde cualquier origen.
app.use(cors({ origin: env.corsOrigin }));

app.use(express.json());

app.use("/api", apiRouter);

// Ruta de verificacion de salud, util para checks de despliegue y para
// confirmar rapidamente que el servidor esta arriba durante el desarrollo.
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Manejador de rutas no encontradas.
app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: "Recurso no encontrado" });
});

// Manejador de errores centralizado. Al declarar 4 parametros, Express lo
// reconoce automaticamente como middleware de manejo de errores. Cualquier
// "next(error)" no capturado en un controlador termina aqui, evitando que
// el proceso se caiga por una excepcion no controlada.
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Error no controlado:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});
