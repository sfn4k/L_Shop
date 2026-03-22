type Response = import("express").Response;
type NextFunction = import("express").NextFunction;
type Request = import("express").Request;

const { clearSessionCookie, getSessionToken } = require("../utils/cookies");
const { HttpError } = require("../utils/http-error");
const { getSessionByToken } = require("../services/users/user.service");

export type AuthenticatedRequest = Request & {
    auth: {
        userId: number;
        token: string;
    };
};

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
    const token = getSessionToken(req);

    if (!token) {
        next(new HttpError(401, "Требуется авторизация"));
        return;
    }

    const session = getSessionByToken(token);

    if (!session) {
        res.setHeader("Set-Cookie", clearSessionCookie());
        next(new HttpError(401, "Сессия истекла, войдите снова"));
        return;
    }

    (req as AuthenticatedRequest).auth = {
        userId: session.userId,
        token,
    };

    next();
}
