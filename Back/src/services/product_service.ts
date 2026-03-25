import fs from "fs";
import { Product, ProductFilters, ProductResponse, ProductView } from "../types/product";
import {Product_path} from "../constants/const";

const readProductFile = (): Product[] => {
    if (!fs.existsSync(Product_path)) {
        return [];
    }

    const file = fs.readFileSync(Product_path, "utf-8").trim();

    if (!file) {
        return [];
    }

    const products: Product[] = JSON.parse(file);
    return products;
}

export const toProductView = (product: Product): ProductView => {
    return {
        id: product.id,
        name: product.name,
        category: product.category,
        material: product.material,
        price: product.price,
        size: product.size,
        type: product.type,
        seats: product.seats,
        description: `Материал: ${product.material}.`,
        stock: 5,
        available: true,
    };
}

export const getProducts = () => {
    const products = readProductFile();
    return products;
};
export const getProductsById = (id: number) => {
    const products = readProductFile();
    const product = products.find((p) => p.id === id);
    return product;
}
export const getProductsByName = (name :string) => {
    const products = readProductFile();
    const foundProducts: Product[] = [];
    const searchName = name.toLowerCase();

    for (const product of products) {
        if (product.name.toLowerCase().includes(searchName)) {
            foundProducts.push(product);
        }
    }

    return foundProducts;
}

export const getProductViewById = (id: number): ProductView | undefined => {
    const product = getProductsById(id);

    if (product == undefined) {
        return undefined;
    }

    return toProductView(product);
}

export const getProductCategories = (): string[] => {
    const products = readProductFile();
    const categories: string[] = [];

    for (const product of products) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    }

    categories.sort();
    return categories;
}

export const getFilteredProducts = (filters: ProductFilters): ProductView[] => {
    const sourceProducts = readProductFile();
    const products: ProductView[] = [];
    for (const sourceProduct of sourceProducts) {
        const product = toProductView(sourceProduct);
        if (filters.search) {
            const search = filters.search.toLowerCase();
            if (!product.name.toLowerCase().includes(search) && !product.description.toLowerCase().includes(search)) {
                continue;
            }
        }
        if (filters.category) {
            if (product.category !== filters.category) {
                continue;
            }
        }
        if (filters.availableOnly) {
            if (!product.available) {
                continue;
            }
        }
        if (typeof filters.minPrice === "number") {
            if (product.price < filters.minPrice) {
                continue;
            }
        }
        if (typeof filters.maxPrice === "number") {
            if (product.price > filters.maxPrice) {
                continue;
            }
        }
        products.push(product);
    }
    if (filters.sort === "price_asc") {
        products.sort((a, b) => a.price - b.price);
    }
    if (filters.sort === "price_desc") {
        products.sort((a, b) => b.price - a.price);
    }

    return products;
}

export const getProductsResponse = (filters: ProductFilters): ProductResponse => {
    return {
        items: getFilteredProducts(filters),
        categories: getProductCategories(),
    };
}
