import { BasketItem } from "./basket"

export type Delivery={
    id: number;
    userId: number;
    items: BasketItem[];
    address: string;
    deliveryType: string;
    status: string;
    totalPrice:number;
}