import { SESSION_COOKIE_NAME, SESSION_TTL_MS } from "../constants/const";

type Request = import("express").Request;

export function parseCookies(cookieHeader?: string): Record<string, string> {
    if (!cookieHeader) {
        return {};
    }

    return cookieHeader
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .reduce<Record<string, string>>((result, part) => {
            const separatorIndex = part.indexOf("=");

            if (separatorIndex === -1) {
                return result;
            }

            const key = part.slice(0, separatorIndex).trim();
            const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
            result[key] = value;
            return result;
        }, {});
}

export function getSessionToken(req: Request): string | null {
    const cookies = parseCookies(req.headers.cookie);
    return cookies[SESSION_COOKIE_NAME] ?? null;
}

export function createSessionCookie(token: string): string {
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toUTCString();
    const maxAgeInSeconds = Math.floor(SESSION_TTL_MS / 1000);

    return `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeInSeconds}; Expires=${expiresAt}`;
}

export function clearSessionCookie(): string {
    return `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=${new Date(0).toUTCString()}`;
}
