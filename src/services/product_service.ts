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
export const getProductsByName = (name :string, description:string) => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    const product = products.filter(p => p.name.toLowerCase().includes(name.toLowerCase()) ||
    p.description.toLowerCase().includes(description.toLowerCase())
    );
    return product;
}
export const getSortProducts = (sort: string) => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    if (sort.toLowerCase() === "smal") {
        products.sort((a, b) => a.price - b.price);
    }
    if (sort.toLowerCase() === "high") {
        products.sort((a, b) => b.price - a.price);
    }
    return products;
}
export const Filter = (category:string) => {
    const file = fs.readFileSync(Product_path, "utf-8");
    const products: Product[] = JSON.parse(file);
    let result = products;
    result = result.filter(p => p.category === category);
    return result;
}
