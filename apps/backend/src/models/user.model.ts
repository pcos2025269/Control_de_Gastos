export type UserRole = "admin" | "user";

export interface User {
    id: number;
    username: string;
    password: string; 
    role: UserRole;
    created_at: Date;
}

export type PublicUser = Omit<User, "password">;

export function toPublicUser(user: User): PublicUser {
    const { password, ...publicUser } = user;
    return publicUser;
}   