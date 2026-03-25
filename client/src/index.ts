import {
    addBasketItem,
    ApiError,
    clearBasket,
    createDelivery,
    fetchBasket,
    fetchProducts,
    fetchSessionState,
    loginUser,
    logoutUser,
    registerUser,
    removeBasketItem,
    updateBasketItem,
} from "./api/index.js";
import { renderAuthPage } from "./components/auth/index.js";
import { renderBasketPage } from "./components/basket/index.js";
import { renderCatalogPage } from "./components/catalog/index.js";
import { renderDeliveryPage } from "./components/delivery/index.js";
import { renderHeader } from "./components/header/index.js";
import { navigate, normalizeRoute, readFiltersFromLocation } from "./router/index.js";
import type { AppRoute, AppState, CatalogFilters } from "./types.js";

const state: AppState = {
    session: {
        user: null,
        basket: null,
        deliveries: [],
    },
    products: [],
    categories: [],
    filters: readFiltersFromLocation(),
    flash: null,
};

function getAppRoot(): HTMLDivElement {
    const root = document.querySelector<HTMLDivElement>("#app");

    if (!root) {
        throw new Error("Корневой элемент #app не найден");
    }

    return root;
}

function getCurrentRoute(): AppRoute {
    return normalizeRoute(window.location.pathname);
}

function showMessage(type: "info" | "error", text: string): void {
    state.flash = { type, text };
}

function clearMessage(): void {
    state.flash = null;
}

function getPageMarkup(route: AppRoute): string {
    if (route === "/auth") {
        return renderAuthPage(state.session);
    }

    if (route === "/basket") {
        return renderBasketPage(state.session);
    }

    if (route === "/delivery") {
        return renderDeliveryPage(state.session);
    }

    return renderCatalogPage({
        products: state.products,
        categories: state.categories,
        filters: state.filters,
        session: state.session,
    });
}

function render(): void {
    const route = getCurrentRoute();
    const message = state.flash
        ? `<div class="message${state.flash.type === "error" ? " message--error" : ""}">${state.flash.text}</div>`
        : "";

    getAppRoot().innerHTML = `
        <div class="layout">
            ${renderHeader(route, state.session)}
            ${message}
            ${getPageMarkup(route)}
        </div>
    `;
}

async function refreshSession(): Promise<void> {
    state.session = await fetchSessionState();
}

async function refreshCatalog(): Promise<void> {
    const response = await fetchProducts(state.filters);
    state.products = response.items;
    state.categories = response.categories;
}

async function syncForRoute(route: AppRoute): Promise<void> {
    state.filters = readFiltersFromLocation();
    await refreshSession();

    if (route === "/catalog") {
        await refreshCatalog();
        return;
    }

    if (route === "/basket" && state.session.user) {
        state.session.basket = await fetchBasket();
        return;
    }

    if (state.products.length === 0) {
        await refreshCatalog();
    }
}

async function handleNavigation(): Promise<void> {
    const route = getCurrentRoute();

    try {
        await syncForRoute(route);
        render();
    } catch (error) {
        handleError(error);
    }
}

function readNumberInput(selector: string): number {
    const input = document.querySelector<HTMLInputElement>(selector);
    const value = Number(input?.value ?? "1");

    if (!Number.isFinite(value) || value <= 0) {
        return 1;
    }

    return value;
}

function changeQuantityInput(
    selector: string,
    direction: "increase" | "decrease",
): number {
    const input = document.querySelector<HTMLInputElement>(selector);

    if (!input) {
        return 1;
    }

    const current = Number(input.value || "1");
    const min = Number(input.min || "1");
    const max = Number(input.max || String(Number.MAX_SAFE_INTEGER));
    const next = direction === "increase" ? current + 1 : current - 1;
    const normalized = Math.min(max, Math.max(min, next));

    input.value = String(normalized);
    return normalized;
}

function handleError(error: unknown): void {
    const message = error instanceof ApiError || error instanceof Error ? error.message : "Произошла ошибка";
    showMessage("error", message);
    render();
}

async function handleCatalogFilterSubmit(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const nextFilters: CatalogFilters = {
        search: String(formData.get("search") ?? "").trim(),
        category: String(formData.get("category") ?? "").trim(),
        sort:
            formData.get("sort") === "price_asc" || formData.get("sort") === "price_desc"
                ? (formData.get("sort") as CatalogFilters["sort"])
                : "",
        availableOnly: formData.get("availableOnly") === "on",
        minPrice: String(formData.get("minPrice") ?? "").trim(),
        maxPrice: String(formData.get("maxPrice") ?? "").trim(),
    };

    state.filters = nextFilters;
    clearMessage();
    navigate("/catalog", nextFilters);
}

async function handleLogin(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const session = await loginUser({
        login: String(formData.get("login") ?? "").trim(),
        password: String(formData.get("password") ?? "").trim(),
    });

    state.session = session;
    showMessage("info", "Вход выполнен");
    navigate("/catalog", state.filters);
}

async function handleRegister(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);
    const session = await registerUser({
        name: String(formData.get("name") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        login: String(formData.get("login") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        password: String(formData.get("password") ?? "").trim(),
    });

    state.session = session;
    showMessage("info", "Регистрация прошла успешно");
    navigate("/catalog", state.filters);
}

async function handleDelivery(form: HTMLFormElement): Promise<void> {
    const formData = new FormData(form);

    await createDelivery({
        address: String(formData.get("address") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        paymentMethod: formData.get("paymentMethod") === "cash" ? "cash" : "card",
    });

    await refreshSession();
    showMessage("info", "Доставка оформлена, корзина очищена");
    navigate("/delivery");
}

async function handleAddToBasket(productId: number): Promise<void> {
    if (!state.session.user) {
        showMessage("error", "Чтобы добавить товар, нужно войти в аккаунт");
        navigate("/auth");
        return;
    }

    const quantity = readNumberInput(`[data-role="catalog-quantity-input"][data-product-id="${productId}"]`);
    state.session.basket = await addBasketItem(productId, quantity);
    showMessage("info", "Товар добавлен в корзину");
    render();
}

async function handleBasketQuantity(productId: number, direction: "increase" | "decrease"): Promise<void> {
    const selector = `[data-role="basket-quantity-input"][data-product-id="${productId}"]`;
    const quantity = changeQuantityInput(selector, direction);
    state.session.basket = await updateBasketItem(productId, quantity);
    showMessage("info", "Количество обновлено");
    render();
}

async function handleClearBasket(): Promise<void> {
    state.session.basket = await clearBasket();
    showMessage("info", "Корзина очищена");
    render();
}

async function handleLogout(): Promise<void> {
    await logoutUser();
    state.session = {
        user: null,
        basket: null,
        deliveries: [],
    };
    showMessage("info", "Вы вышли из аккаунта");
    navigate("/catalog", state.filters);
}

async function onSubmit(event: SubmitEvent): Promise<void> {
    const target = event.target;

    if (!(target instanceof HTMLFormElement)) {
        return;
    }

    event.preventDefault();
    clearMessage();

    try {
        const formType = target.dataset.form;

        if (formType === "catalog-filters") {
            await handleCatalogFilterSubmit(target);
            return;
        }

        if (formType === "login") {
            await handleLogin(target);
            return;
        }

        if (formType === "register") {
            await handleRegister(target);
            return;
        }

        if (formType === "delivery") {
            await handleDelivery(target);
        }
    } catch (error) {
        handleError(error);
    }
}

async function onClick(event: MouseEvent): Promise<void> {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    const routeButton = target.closest<HTMLElement>("[data-route]");

    if (routeButton) {
        const route = routeButton.dataset.route;

        if (route === "/catalog" || route === "/auth" || route === "/basket" || route === "/delivery") {
            clearMessage();
            navigate(route, route === "/catalog" ? state.filters : undefined);
        }

        return;
    }

    const actionButton = target.closest<HTMLElement>("[data-action]");

    if (!actionButton) {
        return;
    }

    const action = actionButton.dataset.action;
    const productId = Number(actionButton.dataset.productId ?? "0");

    try {
        clearMessage();

        if (action === "logout") {
            await handleLogout();
            return;
        }

        if (action === "reset-filters") {
            state.filters = {
                search: "",
                category: "",
                sort: "",
                availableOnly: false,
                minPrice: "",
                maxPrice: "",
            };
            navigate("/catalog", state.filters);
            return;
        }

        if (action === "catalog-quantity") {
            const direction = actionButton.dataset.direction === "decrease" ? "decrease" : "increase";
            changeQuantityInput(`[data-role="catalog-quantity-input"][data-product-id="${productId}"]`, direction);
            return;
        }

        if (action === "add-to-basket") {
            await handleAddToBasket(productId);
            return;
        }

        if (action === "basket-quantity") {
            const direction = actionButton.dataset.direction === "decrease" ? "decrease" : "increase";
            await handleBasketQuantity(productId, direction);
            return;
        }

        if (action === "remove-from-basket") {
            state.session.basket = await removeBasketItem(productId);
            showMessage("info", "Товар удален из корзины");
            render();
            return;
        }

        if (action === "clear-basket") {
            await handleClearBasket();
        }
    } catch (error) {
        handleError(error);
    }
}

window.addEventListener("submit", (event) => {
    void onSubmit(event);
});

window.addEventListener("click", (event) => {
    void onClick(event);
});

window.addEventListener("popstate", () => {
    void handleNavigation();
});

window.addEventListener("l-shop:navigate", () => {
    void handleNavigation();
});

void handleNavigation();
