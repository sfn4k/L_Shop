/**
 * Пользователь в полном формате, который хранится в `users.json`.
 */
export type User = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
    password: string;
};

/**
 * Пользователь без приватных полей для отправки на клиент.
 */
export type PublicUser = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
};

/**
 * Активная пользовательская сессия в `sessions.json`.
 */
export type SessionRecord = {
    token: string;
    userId: number;
    expiresAt: string;
};
