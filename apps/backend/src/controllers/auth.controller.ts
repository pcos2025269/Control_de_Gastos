/**
 * Controlador de autenticacion.
 *
 * Su unica responsabilidad es traducir entre HTTP (Request/Response) y el
 * servicio de negocio: leer el body, invocar authService, y mapear el
 * resultado (o el error) a un codigo de estado y un JSON de respuesta. No
 * contiene reglas de negocio ni SQL.
 */

import { Request, Response } from "express";
import { authService, InvalidCredentialsError } from "../services/auth.service";

export const authController = {
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    // Validacion basica de entrada. Se hace aqui, en el borde HTTP, porque
    // es responsabilidad del controlador asegurar que el servicio reciba
    // datos con la forma esperada.
    if (!username || !password) {
      res.status(400).json({
        message: "Los campos 'username' y 'password' son obligatorios",
      });
      return;
    }

    try {
      const result = await authService.login(username, password);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        res.status(401).json({ message: error.message });
        return;
      }

      console.error("Error inesperado en login:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  /**
   * Endpoint auxiliar que devuelve los datos del usuario autenticado a
   * partir del token ya validado por el middleware. Util para que el
   * frontend pueda "restaurar sesion" al recargar la pagina, verificando
   * que el token guardado en localStorage sigue siendo valido.
   */
  async me(req: Request, res: Response): Promise<void> {
    // req.user es inyectado por el middleware de autenticacion (ver
    // middlewares/auth.middleware.ts) despues de verificar el JWT.
    res.status(200).json({ user: req.user });
  },
};
