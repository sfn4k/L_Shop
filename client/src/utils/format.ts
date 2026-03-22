export function formatPrice(price: number): string {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "BYN",
        maximumFractionDigits: 0,
    }).format(price);
}

export function formatDate(value: string): string {
    return new Intl.DateTimeFormat("ru-RU", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
}

export function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
