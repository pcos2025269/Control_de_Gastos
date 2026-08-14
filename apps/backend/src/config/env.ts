import dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
    const value = process.env[name];
        if (!value) {
    throw new Error(
        `Falta la variable de entorno obligatoria "${name}". Revisa tu archivo .env`
        );
    }
    return value;
}

export const env = {
  port: Number(process.env.PORT ?? 3000),

  db: {
    host: requireEnv("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    name: requireEnv("DB_NAME"),
    user: requireEnv("DB_USER"),
    password: requireEnv("DB_PASSWORD"),
  },

  jwt: {
    secret: requireEnv("JWT_SECRET"),
    expiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  },

  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:4200",
};