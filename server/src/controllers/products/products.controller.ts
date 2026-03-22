type Request = import("express").Request;
type Response = import("express").Response;

const { asyncHandler } = require("../../utils/async-handler");
const {
  getProductById: getProduct,
  listProductCategories,
  listProducts,
} = require("../../services/products/product.service");

function parseBooleanQuery(value: unknown): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

function parseNumberQuery(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim() === "") {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export const getProducts = asyncHandler((req: Request, res: Response) => {
  const items = listProducts({
    search: typeof req.query.search === "string" ? req.query.search : undefined,
    category: typeof req.query.category === "string" ? req.query.category : undefined,
    sort: req.query.sort === "price_asc" || req.query.sort === "price_desc" ? req.query.sort : undefined,
    available: parseBooleanQuery(req.query.available),
    minPrice: parseNumberQuery(req.query.minPrice),
    maxPrice: parseNumberQuery(req.query.maxPrice),
  });

  res.json({
    items,
    categories: listProductCategories(),
  });
});

export const getProductById = asyncHandler((req: Request, res: Response) => {
  const productId = Number(req.params.id);
  res.json(getProduct(productId));
});
