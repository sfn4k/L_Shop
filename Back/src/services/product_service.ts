import fs from "fs";
import { Product, ProductFilters, ProductResponse, ProductView } from "../types/product";
import {Product_path} from "../constants/const";

/**
 * Читает файл с товарами и возвращает массив товаров.
 *
 * @returns {Product[]} Список товаров из JSON-хранилища.
 */
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
};

/**
 * Преобразует товар из базы в формат ответа API.
 *
 * @param {Product} product Товар из JSON-хранилища.
 * @returns {ProductView} Нормализованное представление товара для клиента.
 */
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
};

/**
 * Возвращает все товары без дополнительной фильтрации.
 *
 * @returns {Product[]} Полный список товаров.
 */
export const getProducts = (): Product[] => {
    const products = readProductFile();
    return products;
};

/**
 * Ищет товар по идентификатору.
 *
 * @param {number} id Идентификатор товара.
 * @returns {Product | undefined} Найденный товар или `undefined`.
 */
export const getProductsById = (id: number): Product | undefined => {
    const products = readProductFile();
    const product = products.find((p) => p.id === id);
    return product;
};

/**
 * Ищет товары по части названия без учета регистра.
 *
 * @param {string} name Поисковая строка.
 * @returns {Product[]} Список найденных товаров.
 */
export const getProductsByName = (name :string): Product[] => {
    const products = readProductFile();
    const foundProducts: Product[] = [];
    const searchName = name.toLowerCase();

    for (const product of products) {
        if (product.name.toLowerCase().includes(searchName)) {
            foundProducts.push(product);
        }
    }

    return foundProducts;
};

/**
 * Возвращает товар в формате ответа API по идентификатору.
 *
 * @param {number} id Идентификатор товара.
 * @returns {ProductView | undefined} Преобразованный товар или `undefined`.
 */
export const getProductViewById = (id: number): ProductView | undefined => {
    const product = getProductsById(id);

    if (product == undefined) {
        return undefined;
    }

    return toProductView(product);
};

/**
 * Собирает список уникальных категорий товаров.
 *
 * @returns {string[]} Отсортированный список категорий.
 */
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
};

/**
 * Фильтрует и сортирует товары по параметрам каталога.
 *
 * @param {ProductFilters} filters Параметры фильтрации.
 * @returns {ProductView[]} Подготовленный список товаров.
 */
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
};

/**
 * Формирует полный ответ каталога с товарами и категориями.
 *
 * @param {ProductFilters} filters Параметры фильтрации каталога.
 * @returns {ProductResponse} Ответ API каталога.
 */
export const getProductsResponse = (filters: ProductFilters): ProductResponse => {
    return {
        items: getFilteredProducts(filters),
        categories: getProductCategories(),
    };
};
