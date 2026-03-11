import { Router } from "express";
import {getProducts,getProductById,getProductByName} from "../controllers/product_controller";
import { getUsers, getUserById, getUserByName, registerUser,verifyUser } from "../controllers/user_controllers";
import { getBasket,getBasketById,addProductToBasket,deleteProduct,cleanBasket } from "../controllers/basket_controllers";


const router = Router();
router.get("/products/:id", getProductById);
router.get("/products", getProducts);
router.get("/products/search", getProductByName);
router.get("/users",getUsers);
router.get("/users/:id", getUserById);
router.get("/users/verif/:login/:password",verifyUser);
router.get("/users/search", getUserByName);
router.get("/baskets/:id",getBasketById);
router.get("/baskets",getBasket);


router.post("/users/register",registerUser);
router.post("/basket/add/:userId", addProductToBasket);

router.delete("/basket/clean/:userId",cleanBasket)
router.delete("/basket/delete/:userId/:productId", deleteProduct)


export default router;


