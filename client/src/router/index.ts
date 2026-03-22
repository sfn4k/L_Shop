import type { AppRoute, CatalogFilters } from "../types.js";

export function normalizeRoute(pathname: string): AppRoute {
    if (pathname === "/" || pathname === "/catalog") {
        return "/catalog";
    }

    if (pathname === "/auth" || pathname === "/basket" || pathname === "/delivery") {
        return pathname;
    }

    return "/catalog";
}

function buildSearchParams(filters?: CatalogFilters): string {
    if (!filters) {
        return "";
    }

    const params = new URLSearchParams();

    if (filters.search) {
        params.set("search", filters.search);
    }

    if (filters.category) {
        params.set("category", filters.category);
    }

    if (filters.sort) {
        params.set("sort", filters.sort);
    }

    if (filters.availableOnly) {
        params.set("available", "true");
    }

    if (filters.minPrice) {
        params.set("minPrice", filters.minPrice);
    }

    if (filters.maxPrice) {
        params.set("maxPrice", filters.maxPrice);
    }

    const search = params.toString();
    return search ? `?${search}` : "";
}

export function navigate(route: AppRoute, filters?: CatalogFilters): void {
    const search = route === "/catalog" ? buildSearchParams(filters) : "";
    window.history.pushState({}, "", `${route}${search}`);
    window.dispatchEvent(new Event("l-shop:navigate"));
}

export function readFiltersFromLocation(): CatalogFilters {
    const params = new URLSearchParams(window.location.search);
    const sort = params.get("sort");

    return {
        search: params.get("search") ?? "",
        category: params.get("category") ?? "",
        sort: sort === "price_asc" || sort === "price_desc" ? sort : "",
        availableOnly: params.get("available") === "true",
        minPrice: params.get("minPrice") ?? "",
        maxPrice: params.get("maxPrice") ?? "",
    };
}
