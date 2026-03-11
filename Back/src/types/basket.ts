export type BasketItem = {
    productId: number;
    quantity: number;
}

export type Basket = {
    id: number;
    userId: number;
    items: BasketItem[];
}