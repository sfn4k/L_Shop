import fs from "fs";
import { Product } from "../types/product";
import {Product_path} from "../constants/const";

export const getProducts = () => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    return products;
};
export const getProductsById = (id: number) => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    const product = products.find((p) => p.id === id);
    return product;
}
export const getProductsByName = (name :string) => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    const product =products.find((p) => p.name ===name);
    return product;
}
