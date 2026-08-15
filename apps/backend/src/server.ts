/**
 * Punto de entrada del proceso.
 *
 * Verifica la conexion a la base de datos antes de empezar a aceptar
 * trafico HTTP: no tiene sentido levantar el servidor si no puede hablar
 * con PostgreSQL, ya que todas las rutas relevantes dependen de la base de
 * datos.
 */

import { app } from "./app";
import { env } from "./config/env";
import { testDatabaseConnection } from "./config/database";

async function bootstrap(): Promise<void> {
  try {
    await testDatabaseConnection();

    app.listen(env.port, () => {
      console.log(`Servidor escuchando en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("No fue posible iniciar el servidor:", error);
    process.exit(1);
  }
}

bootstrap();
