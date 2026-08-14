import { Pool } from 'pg';
import { env } from './env';

export const pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
});

pool.on("error", (err) => {
    console.error("Error inesperado en el pool de PostgreSQL:", err);
});

export async function testDatabaseConnection(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    console.log("Conexion a PostgreSQL establecida correctamente.");
  } finally {
    client.release();
  }
}