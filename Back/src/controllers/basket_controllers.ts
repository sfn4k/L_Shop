import { Request, Response } from "express";
import * as basketService from "../services/basket_service";
import { AuthRequest } from "../midlware/midlware";

export const getBasket =(req:Request, res:Response) =>{
    const basket=basketService.getBasket();
    res.json(basket);
}
export const getBasketById = (req: Request, res: Response) => {
    const basket = basketService.getBasketById(Number(req.params.id));
    res.json(basket);
}
export const addProductToBasket=(req:Request, res:Response)=> {
    const { productId } = req.body;
    const basket = basketService.addProductToBasket(Number(req.params.userId), productId);
    res.json(basket);
}
export const deleteProduct =(req:Request,res:Response) => {
    const userId = Number(req.params.userId);
    const productId=Number(req.params.productId);
    const basket=basketService.deleteProduct(userId,productId);
    res.json(basket);
}
export const cleanBasket = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const basket = basketService.cleanBasket(userId);
    res.json(basket);
}

export const getCurrentBasket = (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const auth = authReq.auth;

    if (auth == undefined) {
        res.status(401).json({ message: "Требуется авторизация" });
        return;
    }

    const basket = basketService.getBasketView(auth.userId);
    res.json(basket);
}

export const addProductToCurrentBasket = (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const auth = authReq.auth;

        if (auth == undefined) {
            res.status(401).json({ message: "Требуется авторизация" });
            return;
        }

        const { productId, quantity } = req.body;
        const basket = basketService.addProductToBasketWithQuantity(auth.userId, Number(productId), Number(quantity));
        res.status(201).json(basket);
    } catch (error) {
        let message = "Ошибка корзины";

        if (error instanceof Error) {
            message = error.message;
        }

        res.status(400).json({ message });
    }
}

export const updateCurrentBasketItem = (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const auth = authReq.auth;

        if (auth == undefined) {
            res.status(401).json({ message: "Требуется авторизация" });
            return;
        }

        const basket = basketService.updateBasketItemQuantity(
            auth.userId,
            Number(req.params.productId),
            Number(req.body.quantity),
        );
        res.json(basket);
    } catch (error) {
        let message = "Ошибка корзины";

        if (error instanceof Error) {
            message = error.message;
        }

        res.status(400).json({ message });
    }
}

export const removeCurrentBasketItem = (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const auth = authReq.auth;

        if (auth == undefined) {
            res.status(401).json({ message: "Требуется авторизация" });
            return;
        }

        const basket = basketService.removeBasketItem(auth.userId, Number(req.params.productId));
        res.json(basket);
    } catch (error) {
        let message = "Ошибка корзины";

        if (error instanceof Error) {
            message = error.message;
        }

        res.status(400).json({ message });
    }
}

export const clearCurrentBasket = (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const auth = authReq.auth;

    if (auth == undefined) {
        res.status(401).json({ message: "Требуется авторизация" });
        return;
    }

    const basket = basketService.cleanBasket(auth.userId);
    res.json(basket);
}
