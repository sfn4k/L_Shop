import type { DeliveryView, SessionState } from "../../types.js";
import { escapeHtml, formatDate, formatPrice } from "../../utils/format.js";

function renderDeliveryItem(delivery: DeliveryView): string {
    const statusClass = delivery.status === "delivered" ? " pill--delivered" : "";

    return `
        <article class="delivery-item">
            <div class="delivery-item__top">
                <div>
                    <h3>Заказ #${delivery.id}</h3>
                    <p class="muted">${escapeHtml(delivery.address)}</p>
                </div>
                <span class="pill${statusClass}">${escapeHtml(delivery.status)}</span>
            </div>
            <div class="summary-list">
                <div class="summary-row"><span>Создан</span><strong>${formatDate(delivery.createdAt)}</strong></div>
                <div class="summary-row"><span>Оплата</span><strong>${delivery.paymentMethod === "card" ? "Картой" : "Наличными"}</strong></div>
                <div class="summary-row"><span>Сумма</span><strong>${formatPrice(delivery.totalPrice)}</strong></div>
            </div>
            <div class="summary-list">
                ${delivery.items
                    .map(
                        (item) => `
                            <div class="summary-row">
                                <span>${escapeHtml(item.product.name)} x ${item.quantity}</span>
                                <strong>${formatPrice(item.linePrice)}</strong>
                            </div>
                        `
                    )
                    .join("")}
            </div>
        </article>
    `;
}

export function renderDeliveryPage(session: SessionState): string {
    if (!session.user || !session.basket) {
        return `
            <main class="page">
                <section class="delivery-card empty-state">
                    <h2>Доставка доступна только после входа</h2>
                    <p class="muted">Откройте страницу авторизации и создайте сессию.</p>
                    <button class="btn" data-route="/auth" type="button">Перейти к авторизации</button>
                </section>
            </main>
        `;
    }

    return `
        <main class="page delivery-layout">
            <section class="delivery-card">
                <h2 class="section-title">Оформление доставки</h2>
                <p class="muted">После успешного оформления корзина очищается, а товары переходят в историю доставок.</p>
                <form data-form="delivery" data-delivery-form>
                    <div class="field">
                        <label for="delivery-address">Адрес</label>
                        <textarea id="delivery-address" name="address" data-delivery-address required></textarea>
                    </div>
                    <div class="field">
                        <label for="delivery-phone">Телефон</label>
                        <input id="delivery-phone" name="phone" data-delivery-phone type="tel" value="${escapeHtml(session.user.phone)}" required>
                    </div>
                    <div class="field">
                        <label for="delivery-email">Email</label>
                        <input id="delivery-email" name="email" data-delivery-email type="email" value="${escapeHtml(session.user.email)}" required>
                    </div>
                    <div class="field">
                        <label for="delivery-payment">Оплата</label>
                        <select id="delivery-payment" name="paymentMethod" data-delivery-payment required>
                            <option value="card">Картой</option>
                            <option value="cash">Наличными</option>
                        </select>
                    </div>
                    <div class="summary-list">
                        <div class="summary-row"><span>Товаров в корзине</span><strong>${session.basket.totalItems}</strong></div>
                        <div class="summary-row"><span>К оплате</span><strong>${formatPrice(session.basket.totalPrice)}</strong></div>
                    </div>
                    <div class="inline-actions">
                        <button class="btn" type="submit" ${session.basket.items.length === 0 ? "disabled" : ""}>Подтвердить доставку</button>
                        <button class="btn btn--secondary" data-route="/basket" type="button">Вернуться в корзину</button>
                    </div>
                </form>
            </section>

            <aside class="delivery-card">
                <h2 class="section-title">Активные и прошлые доставки</h2>
                ${session.deliveries.length > 0
                    ? session.deliveries.map(renderDeliveryItem).join("")
                    : '<div class="empty-state"><p class="muted">Доставок пока нет.</p></div>'}
            </aside>
        </main>
    `;
}
