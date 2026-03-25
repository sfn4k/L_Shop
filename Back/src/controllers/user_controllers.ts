import { Request, Response } from "express";
import * as usersService from "../services/user_service";
import * as basketService from "../services/basket_service";
import * as deliveryService from "../services/delivery_service";
import { getCookieValue } from "../midlware/midlware";
import { Session_cookie_name } from "../constants/const";

export const getUsers = (req: Request, res: Response) => {
    const user=usersService.getUsers();
    res.json(user);
}
export const getUserById= (req: Request, res: Response) =>{
    const id=Number(req.params.id);
    const user=usersService.getUserById(id);
    res.json(user);
}
export const getUserByName= (req: Request, res: Response) =>{
    const name=String(req.query.name);
    const user=usersService.getUserByName(name);
    res.json(user);
}
export const registerUser=(req: Request, res:Response) =>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const login = req.body.login;
        const phone = req.body.phone;
        const password = req.body.password;
        const user = usersService.registerUser(name, email, login, phone, password);
        const session = usersService.createSession(user.id);
        res.cookie(Session_cookie_name, session.token, {httpOnly: true,maxAge: 10 * 60 * 1000, sameSite: "lax"});
        res.json({
            user: usersService.toPublicUser(user),
            basket: basketService.getBasketView(user.id),
            deliveries: deliveryService.getDeliveriesByUser(user.id),
        });
    }
    catch(error){
        let message = "Пользователь уже существует";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(400).json({ message });
    }
}
export const verifyUser=(req:Request,res:Response)=>{
    try{
        const login=String(req.params.login);
        const userPassword=String(req.params.password);
        const user=usersService.verifyUser(login,userPassword);
        res.json(usersService.toPublicUser(user));
    }
    catch(error){
        let message = "Ошибка авторизации";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(400).json({ message });
    }
}

export const loginUser = (req: Request, res: Response) => {
    try {
        const login = req.body.login;
        const password = req.body.password;
        const user = usersService.verifyUser(String(login), String(password));
        const session = usersService.createSession(user.id);
        res.cookie(Session_cookie_name, session.token, {
            httpOnly: true,
            maxAge: 10 * 60 * 1000,
            sameSite: "lax",
        });
        res.json({
            user: usersService.toPublicUser(user),
            basket: basketService.getBasketView(user.id),
            deliveries: deliveryService.getDeliveriesByUser(user.id),
        });
    } catch (error) {
        let message = "Ошибка авторизации";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(400).json({ message });
    }
}

export const logoutUser = (req: Request, res: Response) => {
    const token = getCookieValue(req, Session_cookie_name);

    if (token) {
        usersService.destroySession(token);
    }

    res.cookie(Session_cookie_name, "", {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "lax",
    });
    res.json({ success: true });
}

export const getSessionState = (req: Request, res: Response) => {
    const token = getCookieValue(req, Session_cookie_name);
    if (!token) {
        res.json({
            user: null,
            basket: null,
            deliveries: [],
        });
        return;
    }
    const session = usersService.getSessionByToken(token);
    if (!session) {
        res.cookie(Session_cookie_name, "", {
            httpOnly: true,
            expires: new Date(0),
            sameSite: "lax",
        });
        res.json({
            user: null,
            basket: null,
            deliveries: [],
        });
        return;
    }
    const user = usersService.getUserById(session.userId);
    if (user == undefined) {
        res.json({
            user: null,
            basket: null,
            deliveries: [],
        });
        return;
    }
    res.json({
        user: usersService.toPublicUser(user),
        basket: basketService.getBasketView(session.userId),
        deliveries: deliveryService.getDeliveriesByUser(session.userId),
    });
}
