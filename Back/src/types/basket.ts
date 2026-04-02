import { ProductView } from "./product";

/**
 * Строка корзины в файле хранения.
 */
export type BasketItem = {
    productId: number;
    quantity: number;
}

/**
 * Корзина пользователя в базе.
 */
export type Basket = {
    id: number;
    userId: number;
    items: BasketItem[];
}

/**
 * Строка корзины, дополненная данными товара и стоимостью позиции.
 */
export type BasketItemView = BasketItem & {
    linePrice: number;
    product: ProductView;
}

/**
 * Корзина в формате ответа API.
 */
export type BasketView = {
    id: number;
    userId: number;
    items: BasketItemView[];
    totalItems: number;
    totalPrice: number;
}
