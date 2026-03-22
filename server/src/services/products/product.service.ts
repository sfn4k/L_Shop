import { HttpError } from "../../utils/http-error";
import { readCollection, writeCollection } from "../../utils/store";
import { Products_path } from "../../constants/const";
import type { BasketItem } from "../../types/basket";
import type { Product, ProductFilters, ProductView } from "../../types/product";

function toProductView(product: Product): ProductView {
    return {
        ...product,
        available: product.stock > 0,
    };
}

function readProducts(): Product[] {
    return readCollection<Product>(Products_path);
}

function writeProducts(products: Product[]): void {
    writeCollection<Product>(Products_path, products);
}

export function listProducts(filters: ProductFilters): ProductView[] {
    let products = readProducts().map(toProductView);

    if (filters.search) {
        const search = filters.search.trim().toLowerCase();
        products = products.filter((product) =>
            `${product.name} ${product.description}`.toLowerCase().includes(search)
        );
    }

    if (filters.category) {
        products = products.filter((product) => product.category === filters.category);
    }

    if (filters.available !== undefined) {
        products = products.filter((product) => product.available === filters.available);
    }

    if (filters.minPrice !== undefined) {
        products = products.filter((product) => product.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
        products = products.filter((product) => product.price <= filters.maxPrice!);
    }

    if (filters.sort === "price_asc") {
        products.sort((left, right) => left.price - right.price);
    }

    if (filters.sort === "price_desc") {
        products.sort((left, right) => right.price - left.price);
    }

    return products;
}

export function listProductCategories(): string[] {
    return Array.from(new Set(readProducts().map((product) => product.category)));
}

export function getProductById(id: number): Product {
    const product = readProducts().find((currentProduct) => currentProduct.id === id);

    if (!product) {
        throw new HttpError(404, "Товар не найден");
    }

    return product;
}

export function getProductViewById(id: number): ProductView {
    return toProductView(getProductById(id));
}

export function reserveProducts(items: BasketItem[]): void {
    const products = readProducts();

    for (const item of items) {
        const product = products.find((currentProduct) => currentProduct.id === item.productId);

        if (!product) {
            throw new HttpError(404, `Товар с id ${item.productId} не найден`);
        }

        if (product.stock < item.quantity) {
            throw new HttpError(400, `Недостаточно товара "${product.name}" на складе`);
        }
    }

    for (const item of items) {
        const product = products.find((currentProduct) => currentProduct.id === item.productId);

        if (!product) {
            throw new HttpError(404, `Товар с id ${item.productId} не найден`);
        }

        product.stock -= item.quantity;
    }

    writeProducts(products);
}
