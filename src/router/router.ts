import { Router } from "express";
import { checkAuth } from "../midlware/midlware";
import {getProducts,getProductById,getProductByNameOrDescription,Sort,Filter} from "../controllers/product_controller";
import { getUsers, getUserById, getUserByName, registerUser,verifyUser } from "../controllers/user_controllers";
import { getBasket,getBasketById,addProductToBasket,deleteProduct,cleanBasket } from "../controllers/basket_controllers";
import { getAllDeliveries, getDeliveriesByUser, createDelivery, updateDeliveryStatus, deleteDelivery } from "../controllers/delivery_controllers";


const router = Router();
router.get("/products/:id/", getProductById);
router.get("/products", getProducts);
router.get("/products/search", getProductByNameOrDescription);
router.get("/products/sort", Sort);
router.get("/product/filter", Filter);  
router.get("/users",getUsers);
router.get("/users/:id", getUserById);
router.get("/users/verif/:login/:password",verifyUser);
router.get("/users/search", getUserByName);
router.get("/basket/:userId", checkAuth, getBasketById);
router.get("/baskets",getBasket);
router.get("/delivery", checkAuth, getAllDeliveries);
router.get("/delivery/:userId", checkAuth, getDeliveriesByUser);

router.post("/users/register",registerUser);
router.post("/basket/add/:userId", checkAuth, addProductToBasket);
router.post("/delivery/create/:userId", checkAuth, createDelivery);

router.put("/delivery/status/:userId", updateDeliveryStatus);

router.delete("/basket/clean/:userId", checkAuth, cleanBasket);
router.delete("/delivery/clean/:userId", checkAuth, deleteDelivery);
router.delete("/basket/delete/:userId/:productId", checkAuth, deleteProduct);


export default router;


