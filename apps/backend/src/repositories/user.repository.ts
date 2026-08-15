import { pool } from "../config/database";
import { User } from "../models/user.model";

export const userRepository = {
  /**
   * Busca un usuario por su username. Devuelve null si no existe, en vez de
   * lanzar una excepcion, porque "usuario no encontrado" es un resultado
   * valido y esperado durante el login, no un error del sistema.
   */
  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT id, username, password, role, created_at FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Busca un usuario por id. Se usa, por ejemplo, para refrescar los datos
   * del usuario asociado a un token ya validado.
   */
  async findById(id: number): Promise<User | null> {
    const result = await pool.query<User>(
      "SELECT id, username, password, role, created_at FROM users WHERE id = $1",
      [id]
    );
    return result.rows[0] ?? null;
  },


  async create(
    username: string,
    hashedPassword: string,
    role: "admin" | "user"
  ): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (username, password, role)
       VALUES ($1, $2, $3)
       RETURNING id, username, password, role, created_at`,
      [username, hashedPassword, role]
    );
    return result.rows[0];
  },
};
