import type { AppRoute, SessionState } from "../../types.js";
import { escapeHtml } from "../../utils/format.js";

type LinkConfig = {
    href: AppRoute;
    label: string;
};

const links: LinkConfig[] = [
    { href: "/catalog", label: "Каталог" },
    { href: "/basket", label: "Корзина" },
    { href: "/delivery", label: "Доставка" },
    { href: "/auth", label: "Аккаунт" },
];

export function renderHeader(route: AppRoute, session: SessionState): string {
    const basketCount = session.basket?.totalItems ?? 0;
    const userLabel = session.user ? escapeHtml(session.user.name) : "Гость";

    const nav = links
        .map((link) => {
            const active = route === link.href ? " nav__link--active" : "";
            const suffix = link.href === "/basket" && basketCount > 0 ? ` (${basketCount})` : "";

            return `
                <button class="nav__link${active}" data-route="${link.href}" type="button">
                    ${link.label}${suffix}
                </button>
            `;
        })
        .join("");

    return `
        <header class="topbar">
            <div class="brand">
                <h1 class="brand__title">L_Shop</h1>
                <span class="brand__subtitle">Интернет-магазин мебели и декора</span>
            </div>
            <div class="topbar__actions">
                <nav class="nav">
                    ${nav}
                </nav>
                <div class="pill">${userLabel}</div>
                ${session.user ? '<button class="btn btn--secondary" data-action="logout" type="button">Выйти</button>' : ""}
            </div>
        </header>
    `;
}
