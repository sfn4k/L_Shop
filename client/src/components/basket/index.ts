import type { BasketView, SessionState } from "../../types.js";
import { escapeHtml, formatPrice } from "../../utils/format.js";

function renderBasketContent(basket: BasketView): string {
    if (basket.items.length === 0) {
        return `
            <div class="basket-card empty-state">
                <h3>Корзина пока пустая</h3>
                <p class="muted">Добавьте товары из каталога, затем оформите доставку.</p>
                <button class="btn" data-route="/catalog" type="button">Перейти в каталог</button>
            </div>
        `;
    }

    return `
        <div class="basket-card">
            ${basket.items
                .map(
                    (item) => `
                        <article class="basket-item">
                            <div class="basket-item__top">
                                <div>
                                    <h3 data-title="basket">${escapeHtml(item.product.name)}</h3>
                                    <p class="muted">${escapeHtml(item.product.description)}</p>
                                </div>
                                <strong data-price="basket">${formatPrice(item.linePrice)}</strong>
                            </div>
                            <div class="basket-item__actions">
                                <div class="quantity-picker">
                                    <button data-action="basket-quantity" data-direction="decrease" data-product-id="${item.productId}" type="button">-</button>
                                    <input
                                        data-role="basket-quantity-input"
                                        data-product-id="${item.productId}"
                                        type="number"
                                        min="1"
                                        max="${Math.max(item.product.stock, 1)}"
                                        value="${item.quantity}"
                                    >
                                    <button data-action="basket-quantity" data-direction="increase" data-product-id="${item.productId}" type="button">+</button>
                                </div>
                                <div class="inline-actions">
                                    <span class="pill">${formatPrice(item.product.price)} / шт</span>
                                    <button class="btn btn--danger" data-action="remove-from-basket" data-product-id="${item.productId}" type="button">Удалить</button>
                                </div>
                            </div>
                        </article>
                    `
                )
                .join("")}
        </div>
    `;
}

export function renderBasketPage(session: SessionState): string {
    if (!session.user || !session.basket) {
        return `
            <main class="page">
                <section class="basket-card empty-state">
                    <h2>Корзина доступна только авторизованному пользователю</h2>
                    <p class="muted">Сначала зарегистрируйтесь или войдите в аккаунт.</p>
                    <button class="btn" data-route="/auth" type="button">Перейти к авторизации</button>
                </section>
            </main>
        `;
    }

    return `
        <main class="page basket-layout">
            ${renderBasketContent(session.basket)}
            <aside class="basket-card">
                <h2 class="section-title">Сводка заказа</h2>
                <div class="summary-list">
                    <div class="summary-row"><span>Позиции</span><strong>${session.basket.totalItems}</strong></div>
                    <div class="summary-row"><span>Итог</span><strong>${formatPrice(session.basket.totalPrice)}</strong></div>
                </div>
                <div class="inline-actions">
                    <button class="btn" data-route="/delivery" type="button" ${session.basket.items.length === 0 ? "disabled" : ""}>Оформить доставку</button>
                    <button class="btn btn--secondary" data-action="clear-basket" type="button" ${session.basket.items.length === 0 ? "disabled" : ""}>Очистить</button>
                </div>
            </aside>
        </main>
    `;
}
