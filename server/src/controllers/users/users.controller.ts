import type { Request, Response } from "express";

const { asyncHandler } = require("../../utils/async-handler");
const { clearSessionCookie, createSessionCookie, getSessionToken } = require("../../utils/cookies");
const { getBasketView } = require("../../services/basket/basket.service");
const { listDeliveriesForUser } = require("../../services/delivery/delivery.service");
const {
  createSession,
  destroySession,
  getSessionByToken,
  getUserById,
  registerNewUser,
  toPublicUser,
  verifyCredentials,
} = require("../../services/users/user.service");

type RegisterBody = {
  name?: string;
  email?: string;
  login?: string;
  phone?: string;
  password?: string;
};

type LoginBody = {
  login?: string;
  password?: string;
};

function buildSessionState(userId: number) {
  const user = toPublicUser(getUserById(userId));
  const basket = getBasketView(userId);
  const deliveries = listDeliveriesForUser(userId);

  return {
    user,
    basket,
    deliveries,
  };
}

export const getSessionState = asyncHandler((req: Request, res: Response) => {
  const token = getSessionToken(req);

  if (!token) {
    res.json({
      user: null,
      basket: null,
      deliveries: [],
    });
    return;
  }

  const session = getSessionByToken(token);

  if (!session) {
    res.setHeader("Set-Cookie", clearSessionCookie());
    res.json({
      user: null,
      basket: null,
      deliveries: [],
    });
    return;
  }

  res.json(buildSessionState(session.userId));
});

export const registerUser = asyncHandler((req: Request<Record<string, never>, unknown, RegisterBody>, res: Response) => {
  const { name, email, login, phone, password } = req.body;

  if (!name || !email || !login || !phone || !password) {
    res.status(400).json({ message: "Нужно заполнить все поля регистрации" });
    return;
  }

  const user = registerNewUser({ name, email, login, phone, password });
  const session = createSession(user.id);

  res.setHeader("Set-Cookie", createSessionCookie(session.token));
  res.status(201).json(buildSessionState(user.id));
});

export const loginUser = asyncHandler((req: Request<Record<string, never>, unknown, LoginBody>, res: Response) => {
  const { login, password } = req.body;

  if (!login || !password) {
    res.status(400).json({ message: "Нужно указать логин и пароль" });
    return;
  }

  const user = verifyCredentials(login, password);
  const session = createSession(user.id);

  res.setHeader("Set-Cookie", createSessionCookie(session.token));
  res.json(buildSessionState(user.id));
});

export const logoutUser = asyncHandler((req: Request, res: Response) => {
  const token = getSessionToken(req);

  if (token) {
    destroySession(token);
  }

  res.setHeader("Set-Cookie", clearSessionCookie());
  res.json({ success: true });
});
