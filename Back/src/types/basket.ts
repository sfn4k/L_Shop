import { ProductView } from "./product";

export type BasketItem = {
    productId: number;
    quantity: number;
}

export type Basket = {
    id: number;
    userId: number;
    items: BasketItem[];
}

export type BasketItemView = BasketItem & {
    linePrice: number;
    product: ProductView;
}

export type BasketView = {
    id: number;
    userId: number;
    items: BasketItemView[];
    totalItems: number;
    totalPrice: number;
}
