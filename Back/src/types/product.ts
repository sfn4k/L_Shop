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

export type ProductView = Product & {
  description: string
  stock: number
  available: boolean
  image?: string
}

export type ProductResponse = {
  items: ProductView[]
  categories: string[]
}

export type ProductFilters = {
  search: string
  category: string
  sort: "" | "price_asc" | "price_desc"
  availableOnly: boolean
  minPrice?: number
  maxPrice?: number
}
