export type BasketItem = {
    productId: number;
    quantity: number;
};

export type Basket = {
    id: number;
    userId: number;
    items: BasketItem[];
    updatedAt: string;
};

export type BasketItemView = {
    productId: number;
    quantity: number;
    product: import("./product").ProductView;
    linePrice: number;
};

export type BasketView = {
    id: number;
    userId: number;
    items: BasketItemView[];
    totalItems: number;
    totalPrice: number;
};
