import jwt, { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { UserRole } from "../models/user.model";

export interface JwtPayload {
  sub: number; // id del usuario (claim estandar "subject")
    username: string;
    role: UserRole;
}

export function signToken(payload: JwtPayload): string {
    const options: SignOptions = {
        expiresIn: env.jwt.expiresIn as SignOptions["expiresIn"],
    };
    return jwt.sign(payload, env.jwt.secret, options);
}

export function verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.jwt.secret) as unknown as JwtPayload;
}