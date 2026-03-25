import { Request, Response } from "express";
import * as productsService from "../services/product_service";
import { ProductFilters } from "../types/product";

export const getProducts = (req: Request, res: Response) => {
    let sort: ProductFilters["sort"] = "";
    if (req.query.sort === "price_asc") {
        sort = "price_asc";
    }
    if (req.query.sort === "price_desc") {
        sort = "price_desc";
    }
    let search = "";
    let category = "";
    if (req.query.search != undefined) {
        search = String(req.query.search);
    }
    if (req.query.category != undefined) {
        category = String(req.query.category);
    }
    let minPrice = undefined;
    let maxPrice = undefined;
    if (req.query.minPrice != undefined) {
        const numberValue = Number(req.query.minPrice);
        if (Number.isFinite(numberValue)) {
            minPrice = numberValue;
        }
    }
    if (req.query.maxPrice != undefined) {
        const numberValue = Number(req.query.maxPrice);
        if (Number.isFinite(numberValue)) {
            maxPrice = numberValue;
        }
    }

    const filters: ProductFilters = {
        search,
        category,
        sort,
        availableOnly: req.query.available === "true",
        minPrice,
        maxPrice,
    };
    const product=productsService.getProductsResponse(filters);
    res.json(product);
}
export const getProductById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const product = productsService.getProductViewById(id);
    res.json(product);
}
export const getProductByName = (req: Request, res: Response) => {
    let name = "";
    if (req.query.name != undefined) {
        name = String(req.query.name);
    }
    const products=productsService.getProductsByName(name);
    const result = [];
    for (const product of products) {
        result.push(productsService.toProductView(product));
    }
    res.json(result);
}
