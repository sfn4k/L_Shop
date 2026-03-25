type ProductImageCandidate = {
    id: number;
    image?: string | null;
};

const productImageById: Record<number, string> = {
    1: "/dist/images/bed-1.jpg",
    2: "/dist/images/bed-2.jpg",
    3: "/dist/images/bed-3.jpg",
    4: "/dist/images/bed-4.jpg",
    5: "/dist/images/chair-1.jpg",
    6: "/dist/images/chair-2.jpg",
    7: "/dist/images/sofa-1.jpg",
    8: "/dist/images/sofa-2.jpg",
    9: "/dist/images/sofa-3.jpg",
    10: "/dist/images/table-1.jpg",
    11: "/dist/images/table-2.jpg",
};

export function resolveProductImage(product: ProductImageCandidate): string | null {
    if (typeof product.image === "string" && product.image.trim()) {
        return product.image;
    }

    return productImageById[product.id] ?? null;
}
