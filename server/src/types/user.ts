export type User = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
};

export type PublicUser = Omit<User, "password">;

export type Session = {
    token: string;
    userId: number;
    expiresAt: string;
};
