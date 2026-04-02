/**
 * Товар в том виде, в котором он хранится в `product.json`.
 */
export type Product = {
  id: number
  name: string
  category: string
  material: string
  price: number
  size?: number
  type?: string
  seats?: number
}

/**
 * Товар в том виде, в котором он возвращается клиенту.
 */
export type ProductView = Product & {
  description: string
  stock: number
  available: boolean
  image?: string
}

/**
 * Ответ каталога с товарами и доступными категориями.
 */
export type ProductResponse = {
  items: ProductView[]
  categories: string[]
}

/**
 * Параметры фильтрации каталога товаров.
 */
export type ProductFilters = {
  search: string
  category: string
  sort: "" | "price_asc" | "price_desc"
  availableOnly: boolean
  minPrice?: number
  maxPrice?: number
}
