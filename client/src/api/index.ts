import type {
    BasketView,
    CatalogFilters,
    DeliveryView,
    PaymentMethod,
    ProductResponse,
    SessionState,
} from "../types.js";

export class ApiError extends Error {
    status: number;

    constructor(status: number, message: string) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "DELETE";
    body?: unknown;
};

type AuthPayload = {
    name?: string;
    email?: string;
    login: string;
    phone?: string;
    password: string;
};

type DeliveryPayload = {
    address: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethod;
};

function createQueryString(filters: CatalogFilters): string {
    const query = new URLSearchParams();

    if (filters.search) {
        query.set("search", filters.search);
    }

    if (filters.category) {
        query.set("category", filters.category);
    }

    if (filters.sort) {
        query.set("sort", filters.sort);
    }

    if (filters.availableOnly) {
        query.set("available", "true");
    }

    if (filters.minPrice) {
        query.set("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
        query.set("maxPrice", filters.maxPrice);
    }

    const serialized = query.toString();
    return serialized ? `?${serialized}` : "";
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const response = await fetch(`/api${path}`, {
        method: options.method ?? "GET",
        credentials: "include",
        headers: options.body ? { "Content-Type": "application/json" } : undefined,
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const isJson = response.headers.get("content-type")?.includes("application/json") ?? false;
    const payload = isJson ? await response.json() : null;

    if (!response.ok) {
        const message =
            payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
                ? payload.message
                : "Не удалось выполнить запрос";
        throw new ApiError(response.status, message);
    }

    return payload as T;
}

export function fetchSessionState(): Promise<SessionState> {
    return request<SessionState>("/session");
}

export function fetchProducts(filters: CatalogFilters): Promise<ProductResponse> {
    return request<ProductResponse>(`/products${createQueryString(filters)}`);
}

export function registerUser(payload: Required<AuthPayload>): Promise<SessionState> {
    return request<SessionState>("/users/register", {
        method: "POST",
        body: payload,
    });
}

export function loginUser(payload: Pick<AuthPayload, "login" | "password">): Promise<SessionState> {
    return request<SessionState>("/users/login", {
        method: "POST",
        body: payload,
    });
}

export function logoutUser(): Promise<{ success: boolean }> {
    return request<{ success: boolean }>("/users/logout", {
        method: "POST",
    });
}

export function fetchBasket(): Promise<BasketView> {
    return request<BasketView>("/basket");
}

export function addBasketItem(productId: number, quantity: number): Promise<BasketView> {
    return request<BasketView>("/basket/items", {
        method: "POST",
        body: { productId, quantity },
    });
}

export function updateBasketItem(productId: number, quantity: number): Promise<BasketView> {
    return request<BasketView>(`/basket/items/${productId}`, {
        method: "PATCH",
        body: { quantity },
    });
}

export function removeBasketItem(productId: number): Promise<BasketView> {
    return request<BasketView>(`/basket/items/${productId}`, {
        method: "DELETE",
    });
}

export function clearBasket(): Promise<BasketView> {
    return request<BasketView>("/basket", {
        method: "DELETE",
    });
}

export function createDelivery(payload: DeliveryPayload): Promise<DeliveryView> {
    return request<DeliveryView>("/deliveries", {
        method: "POST",
        body: payload,
    });
}
