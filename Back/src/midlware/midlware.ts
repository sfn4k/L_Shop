import { NextFunction, Request, Response } from "express";

import { Session_cookie_name } from "../constants/const";
import { getSessionByToken } from "../services/user_service";

export type AuthRequest = Request & {
    auth?: {
        userId: number;
        token: string;
    };
}

export const getCookieValue = (req: Request, name: string): string | null => {
    const cookieHeader = req.headers.cookie;

    if (!cookieHeader) {
        return null;
    }

    const cookies = cookieHeader.split(";");

    for (const cookie of cookies) {
        const parts = cookie.trim().split("=");
        const cookieName = parts[0];
        parts.shift();
        const cookieValue = parts.join("=");

        if (cookieName === name) {
            return decodeURIComponent(cookieValue);
        }
    }

    return null;
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = getCookieValue(req, Session_cookie_name);

    if (!token) {
        res.status(401).json({ message: "Требуется авторизация" });
        return;
    }

    const session = getSessionByToken(token);

    if (!session) {
        res.cookie(Session_cookie_name, "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "lax",
        });
        res.status(401).json({ message: "Сессия истекла, войдите снова" });
        return;
    }

    const authReq = req as AuthRequest;
    authReq.auth = {
        userId: session.userId,
        token: token,
    };

    next();
};
