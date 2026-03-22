import crypto from "node:crypto";
import { SESSION_TTL_MS, Sessions_path, Users_path } from "../../constants/const";
import type { PublicUser, Session, User } from "../../types/user";
import { HttpError } from "../../utils/http-error";
import { readCollection, writeCollection } from "../../utils/store";

function readUsers(): User[] {
    return readCollection<User>(Users_path);
}

function writeUsers(users: User[]): void {
    writeCollection<User>(Users_path, users);
}

function readSessions(): Session[] {
    return readCollection<Session>(Sessions_path);
}

function writeSessions(sessions: Session[]): void {
    writeCollection<Session>(Sessions_path, sessions);
}

function cleanupExpiredSessions(): Session[] {
    const now = Date.now();
    const activeSessions = readSessions().filter((session) => new Date(session.expiresAt).getTime() > now);
    writeSessions(activeSessions);
    return activeSessions;
}

export function toPublicUser(user: User): PublicUser {
    const { password: _password, ...publicUser } = user;
    return publicUser;
}

export function getUserById(id: number): User {
    const user = readUsers().find((currentUser) => currentUser.id === id);

    if (!user) {
        throw new HttpError(404, "Пользователь не найден");
    }

    return user;
}

export function registerNewUser(payload: Omit<User, "id">): PublicUser {
    const users = readUsers();

    const loginExists = users.some((user) => user.login === payload.login);
    if (loginExists) {
        throw new HttpError(409, "Пользователь с таким логином уже существует");
    }

    const nextId = users.length === 0 ? 1 : Math.max(...users.map((user) => user.id)) + 1;
    const newUser: User = {
        id: nextId,
        ...payload,
    };

    users.push(newUser);
    writeUsers(users);

    return toPublicUser(newUser);
}

export function verifyCredentials(login: string, password: string): PublicUser {
    const user = readUsers().find((currentUser) => currentUser.login === login);

    if (!user || user.password !== password) {
        throw new HttpError(401, "Неверный логин или пароль");
    }

    return toPublicUser(user);
}

export function createSession(userId: number): Session {
    const sessions = cleanupExpiredSessions();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();

    const session: Session = {
        token: crypto.randomUUID(),
        userId,
        expiresAt,
    };

    sessions.push(session);
    writeSessions(sessions);

    return session;
}

export function getSessionByToken(token: string): Session | null {
    const sessions = cleanupExpiredSessions();
    return sessions.find((session) => session.token === token) ?? null;
}

export function destroySession(token: string): void {
    const sessions = readSessions().filter((session) => session.token !== token);
    writeSessions(sessions);
}
