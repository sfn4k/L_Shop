import fs from "fs";
import { Basket, BasketItemView, BasketView } from "../types/basket";
import {Basket_path} from "../constants/const";
import { getProductViewById } from "./product_service";

const readBasketFile = (): Basket[] => {
    if (!fs.existsSync(Basket_path)) {
        return [];
    }

    const file = fs.readFileSync(Basket_path,"utf-8").trim();

    if (!file) {
        return [];
    }

    const parsed = JSON.parse(file) as Basket[] | Basket;

    if (Array.isArray(parsed)) {
        return parsed;
    }

    const baskets: Basket[] = [];
    baskets.push(parsed);
    return baskets;
}

const writeBasketFile = (baskets: Basket[]) => {
    fs.writeFileSync(Basket_path,JSON.stringify(baskets,null,2));
}

export const getBasket=() => {
    const baskets = readBasketFile();
    return baskets;
}
export const getBasketById = (userId:number) => {
    const baskets = readBasketFile();
    const basket=baskets.find((p)=> p.userId===userId);
    return basket;
}

export const addProductToBasket = (userId:number,productId:number) =>{
    const baskets = readBasketFile();
    let userBasket=baskets.find((p) => p.userId===userId);
    if(userBasket==undefined){
        let nextId = 1;
        if (baskets.length > 0) {
            let maxId = baskets[0].id;
            for (const basket of baskets) {
                if (basket.id > maxId) {
                    maxId = basket.id;
                }
            }
            nextId = maxId + 1;
        }
        userBasket = {
            id: nextId,
            userId,
            items: [],
        };
        baskets.push(userBasket);
    }
    const item=userBasket.items.find((p) => p.productId===productId);
    if(item){
        item.quantity+=1;
    }
    else{
        userBasket.items.push({productId:productId, quantity:1})
    }
    writeBasketFile(baskets);
    return userBasket;
}
export const deleteProduct =(userId:number,productId:number)=>{
    const baskets = readBasketFile();
    const userBasket=baskets.find((p) => p.userId===userId)
    if(userBasket==undefined){
        throw new Error("Корзина не найдена");
    }
    const itemIndex=userBasket.items.findIndex((p)=> p.productId===productId);
    if(itemIndex===-1){
        throw new Error("Товара с таким индексом в корзине не найдено")
    }
    const item=userBasket.items.find((i)=> i.productId===productId);
    if(item==undefined){
        throw new Error("Товар не найден")
    }
    if(item.quantity>1){
        item.quantity-=1;
    }
    else{
    userBasket.items.splice(itemIndex, 1);
    }
    writeBasketFile(baskets);
    return userBasket;
}
export const cleanBasket=(userId:number)=>{
    const baskets = readBasketFile();
    const userBasket=baskets.find((p) => p.userId===userId);
    if(userBasket==undefined){
        return getBasketView(userId);
    }
    userBasket.items = [];
    writeBasketFile(baskets);
    return getBasketView(userId);
}

export const getBasketView = (userId: number): BasketView => {
    const basket = getBasketById(userId);
    if (!basket) {
        return {
            id: 0,
            userId,
            items: [],
            totalItems: 0,
            totalPrice: 0,
        };
    }
    const items: BasketItemView[] = [];
    for (const item of basket.items) {
        const product = getProductViewById(item.productId);
        if (product == undefined) {
            continue;
        }
        items.push({
            productId: item.productId,
            quantity: item.quantity,
            linePrice: product.price * item.quantity,
            product: product,
        });
    }
    let totalItems = 0;
    let totalPrice = 0;
    for (const item of items) {
        totalItems += item.quantity;
        totalPrice += item.linePrice;
    }
    return {
        id: basket.id,
        userId: basket.userId,
        items: items,
        totalItems,
        totalPrice,
    };
}

export const addProductToBasketWithQuantity = (userId: number, productId: number, quantity: number) => {
    let safeQuantity = 1;
    if (Number.isInteger(quantity) && quantity > 0) {
        safeQuantity = quantity;
    }
    for (let index = 0; index < safeQuantity; index += 1) {
        addProductToBasket(userId, productId);
    }
    return getBasketView(userId);
}

export const updateBasketItemQuantity = (userId: number, productId: number, quantity: number) => {
    const baskets = readBasketFile();
    const userBasket = baskets.find((basket) => basket.userId === userId);
    if (!userBasket) {
        throw new Error("Корзина не найдена");
    }
    const item = userBasket.items.find((basketItem) => basketItem.productId === productId);
    if (!item) {
        throw new Error("Товар не найден");
    }
    item.quantity = quantity;
    writeBasketFile(baskets);
    return getBasketView(userId);
}

export const removeBasketItem = (userId: number, productId: number) => {
    const baskets = readBasketFile();
    const userBasket = baskets.find((basket) => basket.userId === userId);
    if (!userBasket) {
        throw new Error("Корзина не найдена");
    }
    const newItems = [];
    for (const item of userBasket.items) {
        if (item.productId !== productId) {
            newItems.push(item);
        }
    }
    userBasket.items = newItems;
    writeBasketFile(baskets);
    return getBasketView(userId);
}
