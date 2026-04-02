import { Router } from "express";
import { checkAuth } from "../midlware/midlware";
import { getProducts, getProductById, getProductByName } from "../controllers/product_controller";
import { getSessionState, getUsers, getUserById, getUserByName, loginUser, logoutUser, registerUser, verifyUser } from "../controllers/user_controllers";
import { getBasket, getBasketById, addProductToBasket, deleteProduct, cleanBasket, getCurrentBasket, addProductToCurrentBasket, updateCurrentBasketItem, removeCurrentBasketItem, clearCurrentBasket } from "../controllers/basket_controllers";
import { getAllDeliveries, createDelivery, updateDeliveryStatus } from "../controllers/delivery_controllers";


const router = Router();
router.get("/session", getSessionState);
router.get("/products/search", getProductByName);
router.get("/products/:id", getProductById);
router.get("/products", getProducts);
router.get("/users", getUsers);
router.get("/users/verif/:login/:password", verifyUser);
router.get("/users/search", getUserByName);
router.get("/users/:id", getUserById);
router.get("/baskets/:id", getBasketById);
router.get("/baskets", getBasket);
router.get("/basket", checkAuth, getCurrentBasket);
router.get("/deliveries", checkAuth, getAllDeliveries);


router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.post("/users/logout", logoutUser);
router.post("/basket/add/:userId", addProductToBasket);
router.post("/basket/items", checkAuth, addProductToCurrentBasket);
router.post("/deliveries", checkAuth, createDelivery);

router.delete("/basket/clean/:userId", cleanBasket);
router.delete("/basket/delete/:userId/:productId", deleteProduct);
router.delete("/basket", checkAuth, clearCurrentBasket);
router.delete("/basket/items/:productId", checkAuth, removeCurrentBasketItem);
router.patch("/basket/items/:productId", checkAuth, updateCurrentBasketItem);
router.patch("/deliveries/:deliveryId/status", checkAuth, updateDeliveryStatus);


export default router;
