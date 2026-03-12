import { Request, response, Response } from "express";
import * as productsService from "../services/product_service";
import { request } from "http";

export const getProducts = (req: Request, res: Response) => {
    const product=productsService.getProducts();
    res.json(product);
}
export const getProductById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = productsService.getProductsById(id);
    res.json(product);
}
export const getProductByNameOrDescription = (req: Request, res: Response) => {
    const name = req.query.name as string;
    const description =req.query.description as string;
    const products=productsService.getProductsByName(name,description);
    res.json(products);
}
export const Sort =(req: Request,res: Response) => {
    const sort=req.query.sort as string;
    const product=productsService.getSortProducts(sort);
    res.json(product);
} 
export const Filter = (req:Request, res:Response) => {
    const category=req.query.category as string;
    const product=productsService.Filter(category);
    res.json(product);
}