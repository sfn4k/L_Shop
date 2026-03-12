import { Request, Response } from "express";
import * as basketService from "../services/basket_service";

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