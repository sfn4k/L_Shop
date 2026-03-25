export type User = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
};

export type PublicUser = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
};

export type SessionRecord = {
    token: string;
    userId: number;
    expiresAt: string;
};
