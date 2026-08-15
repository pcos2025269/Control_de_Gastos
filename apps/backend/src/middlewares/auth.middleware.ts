/**
 * Middleware de autenticacion.
 *
 * Se coloca delante de cualquier ruta que requiera un usuario logueado.
 * Su trabajo es exclusivamente: extraer el token de la cabecera
 * Authorization, verificarlo, y si es valido, adjuntar el payload
 * decodificado a req.user para que los controladores y middlewares
 * posteriores (como requireRole) puedan usarlo sin volver a tocar el
 * token.
 *
 * No consulta la base de datos en cada peticion a proposito: el JWT ya
 * contiene id, username y role firmados, por lo que confiar en su
 * contenido (una vez verificada la firma) evita una consulta extra por
 * cada request protegido. Esta es una decision de diseno deliberada para
 * escalabilidad; si en el futuro se necesita poder revocar tokens antes de
 * que expiren, este es el lugar donde se anadiria esa verificacion
 * adicional (por ejemplo, contra una lista negra en Redis).
 */

import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils/jwt.util";

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token de autenticacion no proporcionado" });
    return;
  }

  const token = authHeader.slice("Bearer ".length);

  try {
    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    // Cualquier fallo de verificacion (firma invalida, token expirado,
    // token malformado) se trata de la misma forma desde la perspectiva
    // del cliente: 401, sesion no valida, debe volver a iniciar sesion.
    res.status(401).json({ message: "Token invalido o expirado" });
  }
}
