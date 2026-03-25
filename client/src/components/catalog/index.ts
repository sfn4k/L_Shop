import type { CatalogFilters, Product, SessionState } from "../../types.js";
import { resolveProductImage } from "../../utils/product-images.js";
import { escapeHtml, formatPrice } from "../../utils/format.js";

type CatalogPageProps = {
    products: Product[];
    categories: string[];
    filters: CatalogFilters;
    session: SessionState;
};

function renderProductCard(product: Product): string {
    const resolvedImage = resolveProductImage(product);
    const image = resolvedImage
        ? `<img class="product-card__image" src="${escapeHtml(resolvedImage)}" alt="${escapeHtml(product.name)}" loading="lazy">`
        : '<div class="product-card__image"></div>';
    const availabilityClass = product.available ? "" : " availability--empty";
    const availabilityLabel = product.available ? `В наличии: ${product.stock}` : "Нет в наличии";
    const quantity = product.available ? 1 : 0;

    return `
        <article class="product-card">
            ${image}
            <div class="product-card__body">
                <h3 data-title>${escapeHtml(product.name)}</h3>
                <p class="product-card__description">${escapeHtml(product.description)}</p>
                <div class="product-card__meta">
                    <span>${product.type ? escapeHtml(product.type) : "Мебель"}</span>
                    <span>${product.size ? `${product.size} см` : product.seats ? `${product.seats} мест` : "Размер уточняется"}</span>
                </div>
                <div class="product-card__footer">
                    <span class="price" data-price>${formatPrice(product.price)}</span>
                    <span class="availability${availabilityClass}">${availabilityLabel}</span>
                </div>
                <div class="inline-actions">
                    <div class="quantity-picker">
                        <button data-action="catalog-quantity" data-direction="decrease" data-product-id="${product.id}" type="button">-</button>
                        <input
                            data-role="catalog-quantity-input"
                            data-product-id="${product.id}"
                            type="number"
                            min="1"
                            max="${Math.max(product.stock, 1)}"
                            value="${quantity}"
                            ${product.available ? "" : "disabled"}
                        >
                        <button data-action="catalog-quantity" data-direction="increase" data-product-id="${product.id}" type="button" ${product.available ? "" : "disabled"}>+</button>
                    </div>
                    <button class="btn" data-action="add-to-basket" data-product-id="${product.id}" type="button" ${product.available ? "" : "disabled"}>
                        В корзину
                    </button>
                </div>
            </div>
        </article>
    `;
}

export function renderCatalogPage(props: CatalogPageProps): string {
    const productsCount = props.products.length;
    const availableCount = props.products.filter((product) => product.available).length;
    const registeredLabel = props.session.user ? "Можно сразу добавлять товары в корзину." : "Войдите, чтобы оформлять корзину и доставку.";

    return `
        <main class="page">
            <section class="hero">
                <div class="hero__card">
                    <h2 class="hero__title">Каталог мебели</h2>
                    <p class="hero__text">${registeredLabel}</p>
                    <div class="hero__stats">
                        <div class="stat">
                            <span class="stat__value">${productsCount}</span>
                            <span class="stat__label">Товаров в выдаче</span>
                        </div>
                        <div class="stat">
                            <span class="stat__value">${availableCount}</span>
                            <span class="stat__label">Есть в наличии</span>
                        </div>
                        <div class="stat">
                            <span class="stat__value">${props.categories.length}</span>
                            <span class="stat__label">Категорий</span>
                        </div>
                    </div>
                </div>
            </section>

            <section class="panel">
                <h3 class="panel__title">Фильтры каталога</h3>
                <form class="filters-form" data-form="catalog-filters">
                    <div class="field">
                        <label for="search">Поиск</label>
                        <input id="search" name="search" type="search" value="${escapeHtml(props.filters.search)}" placeholder="Название или описание">
                    </div>
                    <div class="field">
                        <label for="category">Категория</label>
                        <select id="category" name="category">
                            <option value="">Все категории</option>
                            ${props.categories
                                .map(
                                    (category) => `
                                        <option value="${escapeHtml(category)}" ${props.filters.category === category ? "selected" : ""}>
                                            ${escapeHtml(category)}
                                        </option>
                                    `
                                )
                                .join("")}
                        </select>
                    </div>
                    <div class="field">
                        <label for="sort">Сортировка</label>
                        <select id="sort" name="sort">
                            <option value="">Без сортировки</option>
                            <option value="price_asc" ${props.filters.sort === "price_asc" ? "selected" : ""}>Сначала дешевле</option>
                            <option value="price_desc" ${props.filters.sort === "price_desc" ? "selected" : ""}>Сначала дороже</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="minPrice">Цена от</label>
                        <input id="minPrice" name="minPrice" type="number" min="0" value="${escapeHtml(props.filters.minPrice)}" placeholder="0">
                    </div>
                    <div class="field">
                        <label for="maxPrice">Цена до</label>
                        <input id="maxPrice" name="maxPrice" type="number" min="0" value="${escapeHtml(props.filters.maxPrice)}" placeholder="5000">
                    </div>
                    <div class="filters-actions">
                        <label class="pill">
                            <input name="availableOnly" type="checkbox" ${props.filters.availableOnly ? "checked" : ""}>
                            Только доступные
                        </label>
                    </div>
                    <div class="filters-actions">
                        <button class="btn" type="submit">Применить</button>
                        <button class="btn btn--secondary" type="button" data-action="reset-filters">Сбросить</button>
                    </div>
                </form>
            </section>

            <section class="catalog-grid">
                ${props.products.length > 0
                    ? props.products.map(renderProductCard).join("")
                    : '<div class="panel empty-state"><h3>Ничего не найдено</h3><p class="muted">Измените фильтры и попробуйте снова.</p></div>'}
            </section>
        </main>
    `;
}
