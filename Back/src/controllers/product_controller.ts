import { Request, Response } from "express";
import * as productsService from "../services/product_service";

export const getProducts = (req: Request, res: Response) => {
    const product=productsService.getProducts();
    res.json(product);
}
export const getProductById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = productsService.getProductsById(id);
    res.json(product);
}
export const getProductByName = (req: Request, res: Response) => {
    const name = req.query.name as string;
    const products=productsService.getProductsByName(name);
    res.json(products);
}
