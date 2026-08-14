import bcrypt from "bcrypt";
import { userRepository } from "../repositories/user.repository";
import { signToken } from "../utils/jwt.util";
import { toPublicUser, PublicUser } from "../models/user.model";

export class InvalidCredentialsError extends Error {
    constructor() {
        super("Usuario o contrasena incorrectos");
        this.name = "InvalidCredentialsError";
    }
}

export interface LoginResult {
    token: string;
    user: PublicUser;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResult> {
    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    const token = signToken({
      sub: user.id,
      username: user.username,
      role: user.role,
    });

    return { token, user: toPublicUser(user) };
  },
};
