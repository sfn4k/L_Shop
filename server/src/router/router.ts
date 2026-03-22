import { Router } from "express";

import { addBasketItem, clearCurrentBasket, getCurrentBasket, removeBasketItem, updateBasketItem } from "../controllers/basket/basket.controller";
import { createDelivery, getCurrentDeliveries, updateDeliveryStatus } from "../controllers/delivery/delivery.controller";
import { getProducts, getProductById } from "../controllers/products/products.controller";
import { getSessionState, loginUser, logoutUser, registerUser } from "../controllers/users/users.controller";
import { requireAuth } from "../middleware/auth.middleware";

const apiRouter = Router();

apiRouter.get("/session", getSessionState);

apiRouter.post("/users/register", registerUser);
apiRouter.post("/users/login", loginUser);
apiRouter.post("/users/logout", logoutUser);

apiRouter.get("/products", getProducts);
apiRouter.get("/products/:id", getProductById);

apiRouter.get("/basket", requireAuth, getCurrentBasket);
apiRouter.post("/basket/items", requireAuth, addBasketItem);
apiRouter.patch("/basket/items/:productId", requireAuth, updateBasketItem);
apiRouter.delete("/basket/items/:productId", requireAuth, removeBasketItem);
apiRouter.delete("/basket", requireAuth, clearCurrentBasket);

apiRouter.get("/deliveries", requireAuth, getCurrentDeliveries);
apiRouter.post("/deliveries", requireAuth, createDelivery);
apiRouter.patch("/deliveries/:deliveryId/status", requireAuth, updateDeliveryStatus);

export {
  apiRouter,
};
