export type Product = {
    id: number;
    name: string;
    category: string;
    material: string;
    description: string;
    price: number;
    stock: number;
    size?: number;
    type?: string;
    seats?: number;
    image?: string;
};

export type ProductView = Product & {
    available: boolean;
};

export type ProductFilters = {
    search?: string;
    category?: string;
    sort?: "price_asc" | "price_desc";
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
};
