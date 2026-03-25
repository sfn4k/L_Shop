export type Deliver={
    id:number;
    adres:string;
    
    finalCost:number;
    userId:number;
}

import { BasketItem, BasketItemView } from "./basket";

export type PaymentMethod = "card" | "cash";
export type DeliveryStatus = "processing" | "paid" | "shipped" | "delivered";

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
