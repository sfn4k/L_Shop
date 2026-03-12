import { Request, Response, NextFunction } from "express";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    const session = req.cookies.session;
    if (!session) {
        res.status(401).json({ message: "Пользователь не авторизован" });
        return;
    }
    next();
}