type Response = import("express").Response;

const { asyncHandler } = require("../../utils/async-handler");
const {
  addItemToBasket,
  clearBasket,
  getBasketView,
  removeItemFromBasket,
  updateBasketItemQuantity,
} = require("../../services/basket/basket.service");

type AuthenticatedRequest = import("../../middleware/auth.middleware").AuthenticatedRequest;

type AddItemBody = {
  productId?: number;
  quantity?: number;
};

type UpdateItemBody = {
  quantity?: number;
};

export const getCurrentBasket = asyncHandler((req: AuthenticatedRequest, res: Response) => {
  res.json(getBasketView(req.auth.userId));
});

export const addBasketItem = asyncHandler((req: AuthenticatedRequest & { body: AddItemBody }, res: Response) => {
  const productId = Number(req.body.productId);
  const quantity = Number(req.body.quantity ?? 1);

  res.json(addItemToBasket(req.auth.userId, productId, quantity));
});

export const updateBasketItem = asyncHandler((req: AuthenticatedRequest & { body: UpdateItemBody }, res: Response) => {
  const productId = Number(req.params.productId);
  const quantity = Number(req.body.quantity);

  res.json(updateBasketItemQuantity(req.auth.userId, productId, quantity));
});

export const removeBasketItem = asyncHandler((req: AuthenticatedRequest, res: Response) => {
  const productId = Number(req.params.productId);
  res.json(removeItemFromBasket(req.auth.userId, productId));
});

export const clearCurrentBasket = asyncHandler((req: AuthenticatedRequest, res: Response) => {
  res.json(clearBasket(req.auth.userId));
});
