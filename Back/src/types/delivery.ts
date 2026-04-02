import { BasketItem, BasketItemView } from "./basket";

/**
 * Доступные способы оплаты доставки.
 */
export type PaymentMethod = "card" | "cash";

/**
 * Возможные статусы доставки заказа.
 */
export type DeliveryStatus = "processing" | "paid" | "shipped" | "delivered";

/**
 * Доставка в том виде, в котором она хранится в `delivery.json`.
 */
export type Delivery = {
    id: number;
    userId: number;
    items: BasketItem[];
    address: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethod;
    status: DeliveryStatus;
    totalPrice: number;
    createdAt: string;
}

/**
 * Доставка в формате ответа API.
 */
export type DeliveryView = {
    id: number;
    userId: number;
    items: BasketItemView[];
    address: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethod;
    status: DeliveryStatus;
    totalPrice: number;
    createdAt: string;
    active: boolean;
}
