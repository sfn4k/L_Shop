import { Basket_path } from "../../constants/const";
import type { Basket, BasketItem, BasketView } from "../../types/basket";
import { HttpError } from "../../utils/http-error";
import { readCollection, writeCollection } from "../../utils/store";
import { getProductById, getProductViewById } from "../products/product.service";

function readBaskets(): Basket[] {
    return readCollection<Basket>(Basket_path);
}

function writeBaskets(baskets: Basket[]): void {
    writeCollection<Basket>(Basket_path, baskets);
}

function toBasketView(basket: Basket): BasketView {
    const items = basket.items.map((item) => {
        const product = getProductViewById(item.productId);

        return {
            productId: item.productId,
            quantity: item.quantity,
            product,
            linePrice: product.price * item.quantity,
        };
    });

    return {
        id: basket.id,
        userId: basket.userId,
        items,
        totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: items.reduce((sum, item) => sum + item.linePrice, 0),
    };
}

export function getOrCreateBasket(userId: number): Basket {
    const baskets = readBaskets();
    const existingBasket = baskets.find((basket) => basket.userId === userId);

    if (existingBasket) {
        return existingBasket;
    }

    const nextId = baskets.length === 0 ? 1 : Math.max(...baskets.map((basket) => basket.id)) + 1;
    const newBasket: Basket = {
        id: nextId,
        userId,
        items: [],
        updatedAt: new Date().toISOString(),
    };

    baskets.push(newBasket);
    writeBaskets(baskets);

    return newBasket;
}

function saveBasket(updatedBasket: Basket): Basket {
    const baskets = readBaskets();
    const basketIndex = baskets.findIndex((basket) => basket.userId === updatedBasket.userId);

    if (basketIndex === -1) {
        baskets.push(updatedBasket);
    } else {
        baskets[basketIndex] = updatedBasket;
    }

    writeBaskets(baskets);

    return updatedBasket;
}

export function getBasketView(userId: number): BasketView {
    return toBasketView(getOrCreateBasket(userId));
}

export function getBasket(userId: number): Basket {
    return getOrCreateBasket(userId);
}

export function addItemToBasket(userId: number, productId: number, quantity: number): BasketView {
    if (quantity <= 0) {
        throw new HttpError(400, "Количество товара должно быть больше нуля");
    }

    const product = getProductById(productId);
    if (product.stock <= 0) {
        throw new HttpError(400, "Товар недоступен");
    }

    const basket = getOrCreateBasket(userId);
    const basketItem = basket.items.find((item) => item.productId === productId);
    const currentQuantity = basketItem?.quantity ?? 0;

    if (currentQuantity + quantity > product.stock) {
        throw new HttpError(400, "Нельзя добавить в корзину больше, чем есть на складе");
    }

    if (basketItem) {
        basketItem.quantity += quantity;
    } else {
        basket.items.push({ productId, quantity });
    }

    basket.updatedAt = new Date().toISOString();
    return toBasketView(saveBasket(basket));
}

export function updateBasketItemQuantity(userId: number, productId: number, quantity: number): BasketView {
    const basket = getOrCreateBasket(userId);
    const basketItem = basket.items.find((item) => item.productId === productId);

    if (!basketItem) {
        throw new HttpError(404, "Товар не найден в корзине");
    }

    if (quantity <= 0) {
        basket.items = basket.items.filter((item) => item.productId !== productId);
    } else {
        const product = getProductById(productId);
        if (quantity > product.stock) {
            throw new HttpError(400, "Нельзя указать количество больше доступного на складе");
        }

        basketItem.quantity = quantity;
    }

    basket.updatedAt = new Date().toISOString();
    return toBasketView(saveBasket(basket));
}

export function removeItemFromBasket(userId: number, productId: number): BasketView {
    const basket = getOrCreateBasket(userId);
    const nextItems = basket.items.filter((item) => item.productId !== productId);

    if (nextItems.length === basket.items.length) {
        throw new HttpError(404, "Товар не найден в корзине");
    }

    basket.items = nextItems;
    basket.updatedAt = new Date().toISOString();
    return toBasketView(saveBasket(basket));
}

export function clearBasket(userId: number): BasketView {
    const basket = getOrCreateBasket(userId);
    basket.items = [];
    basket.updatedAt = new Date().toISOString();
    return toBasketView(saveBasket(basket));
}
