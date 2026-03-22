import type { BasketItem, BasketItemView } from "./basket";

export type DeliveryStatus = "processing" | "paid" | "shipped" | "delivered";
export type PaymentMethod = "card" | "cash";

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
};

export type DeliveryView = Omit<Delivery, "items"> & {
    items: BasketItemView[];
    active: boolean;
};
