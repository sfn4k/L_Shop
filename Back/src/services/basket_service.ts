import fs from "fs";
import { Basket, BasketItemView, BasketView } from "../types/basket";
import {Basket_path} from "../constants/const";
import { getProductViewById } from "./product_service";

/**
 * Читает корзины пользователей из JSON-хранилища.
 *
 * @returns {Basket[]} Список корзин.
 */
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
};

/**
 * Сохраняет список корзин в JSON-хранилище.
 *
 * @param {Basket[]} baskets Актуальный список корзин.
 * @returns {void}
 */
const writeBasketFile = (baskets: Basket[]): void => {
    fs.writeFileSync(Basket_path,JSON.stringify(baskets,null,2));
};

/**
 * Возвращает все корзины без преобразования.
 *
 * @returns {Basket[]} Список корзин из хранилища.
 */
export const getBasket=(): Basket[] => {
    const baskets = readBasketFile();
    return baskets;
};

/**
 * Ищет корзину пользователя по `userId`.
 *
 * @param {number} userId Идентификатор пользователя.
 * @returns {Basket | undefined} Найденная корзина или `undefined`.
 */
export const getBasketById = (userId:number): Basket | undefined => {
    const baskets = readBasketFile();
    const basket=baskets.find((p)=> p.userId===userId);
    return basket;
};

/**
 * Добавляет товар в корзину пользователя или увеличивает количество существующей позиции.
 *
 * @param {number} userId Идентификатор пользователя.
 * @param {number} productId Идентификатор товара.
 * @returns {Basket} Обновленная корзина пользователя.
 */
export const addProductToBasket = (userId:number,productId:number): Basket =>{
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
};

/**
 * Уменьшает количество товара в корзине или удаляет позицию полностью.
 *
 * @param {number} userId Идентификатор пользователя.
 * @param {number} productId Идентификатор товара.
 * @returns {Basket} Обновленная корзина пользователя.
 * @throws {Error} Если корзина или товар не найдены.
 */
export const deleteProduct =(userId:number,productId:number): Basket =>{
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
};

/**
 * Полностью очищает корзину пользователя.
 *
 * @param {number} userId Идентификатор пользователя.
 * @returns {BasketView} Корзина в формате ответа API после очистки.
 */
export const cleanBasket=(userId:number): BasketView=>{
    const baskets = readBasketFile();
    const userBasket=baskets.find((p) => p.userId===userId);
    if(userBasket==undefined){
        return getBasketView(userId);
    }
    userBasket.items = [];
    writeBasketFile(baskets);
    return getBasketView(userId);
};

/**
 * Возвращает корзину пользователя в расширенном формате для клиента.
 *
 * @param {number} userId Идентификатор пользователя.
 * @returns {BasketView} Корзина с товарами и рассчитанными итогами.
 */
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
};

/**
 * Добавляет товар в корзину указанное количество раз.
 *
 * @param {number} userId Идентификатор пользователя.
 * @param {number} productId Идентификатор товара.
 * @param {number} quantity Количество для добавления.
 * @returns {BasketView} Обновленная корзина в формате ответа API.
 */
export const addProductToBasketWithQuantity = (userId: number, productId: number, quantity: number): BasketView => {
    let safeQuantity = 1;
    if (Number.isInteger(quantity) && quantity > 0) {
        safeQuantity = quantity;
    }
    for (let index = 0; index < safeQuantity; index += 1) {
        addProductToBasket(userId, productId);
    }
    return getBasketView(userId);
};

/**
 * Обновляет количество товара в корзине пользователя.
 *
 * @param {number} userId Идентификатор пользователя.
 * @param {number} productId Идентификатор товара.
 * @param {number} quantity Новое количество товара.
 * @returns {BasketView} Обновленная корзина в формате ответа API.
 * @throws {Error} Если корзина или товар не найдены.
 */
export const updateBasketItemQuantity = (userId: number, productId: number, quantity: number): BasketView => {
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
};

/**
 * Удаляет товар из корзины пользователя независимо от количества.
 *
 * @param {number} userId Идентификатор пользователя.
 * @param {number} productId Идентификатор товара.
 * @returns {BasketView} Обновленная корзина в формате ответа API.
 * @throws {Error} Если корзина не найдена.
 */
export const removeBasketItem = (userId: number, productId: number): BasketView => {
    const baskets = readBasketFile();
    const userBasket = baskets.find((basket) => basket.userId === userId);
    if (!userBasket) {
        throw new Error("Корзина не найдена");
    }
    const newItems: Basket["items"] = [];
    for (const item of userBasket.items) {
        if (item.productId !== productId) {
            newItems.push(item);
        }
    }
    userBasket.items = newItems;
    writeBasketFile(baskets);
    return getBasketView(userId);
};
