export type Product = {
    id: number;
    name: string;
    description: string;
    category: string;
    material: string;
    price: number;
    stock: number;
    available: boolean;
    size?: number;
    type?: string;
    seats?: number;
    image?: string;
};

export type ProductResponse = {
    items: Product[];
    categories: string[];
};

export type PublicUser = {
    id: number;
    name: string;
    email: string;
    login: string;
    phone: string;
};

export type BasketItemView = {
    productId: number;
    quantity: number;
    linePrice: number;
    product: Product;
};

export type BasketView = {
    id: number;
    userId: number;
    items: BasketItemView[];
    totalItems: number;
    totalPrice: number;
};

export type DeliveryStatus = "processing" | "paid" | "shipped" | "delivered";
export type PaymentMethod = "card" | "cash";

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
};

export type SessionState = {
    user: PublicUser | null;
    basket: BasketView | null;
    deliveries: DeliveryView[];
};

export type CatalogFilters = {
    search: string;
    category: string;
    sort: "" | "price_asc" | "price_desc";
    availableOnly: boolean;
    minPrice: string;
    maxPrice: string;
};

export type AppRoute = "/" | "/catalog" | "/auth" | "/basket" | "/delivery";

export type FlashMessage = {
    type: "info" | "error";
    text: string;
} | null;

export type AppState = {
    session: SessionState;
    products: Product[];
    categories: string[];
    filters: CatalogFilters;
    flash: FlashMessage;
};
