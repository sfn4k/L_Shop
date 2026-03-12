import fs from "fs";
import { Basket } from "../types/basket";
import {Basket_path} from "../constants/const";

export const getBasket=() => {
    const file=fs.readFileSync(Basket_path,"utf-8");
    const baskets:Basket[] = JSON.parse(file);
    return baskets;
}
export const getBasketById = (userId:number) => {
    const file=fs.readFileSync(Basket_path,"utf-8");
    const baskets:Basket[] = JSON.parse(file);
    const basket=baskets.find((p)=> p.userId===userId);
    return basket;
}

export const addProductToBasket = (userId:number,productId:number) =>{
    const file=fs.readFileSync(Basket_path,"utf-8");
    const baskets:Basket[]=JSON.parse(file);
    const userBasket=baskets.find((p) => p.userId===userId);
    if(userBasket==undefined){
            throw new Error("Корзина не найдена!")
    }
    const item=userBasket.items.find((p) => p.productId===productId);
    if(item){
        item.quantity+=1;
    }
    else{
        userBasket.items.push({productId:productId, quantity:1})
    }
    fs.writeFileSync(Basket_path,JSON.stringify(baskets,null,2));
    return userBasket;
}
export const deleteProduct =(userId:number,productId:number)=>{
    const file=fs.readFileSync(Basket_path,"utf-8");
    const baskets:Basket[]=JSON.parse(file);
    const userBasket=baskets.find((p) => p.userId===userId)
    if(userBasket==undefined){
        throw new Error("Корзина не найдена");
    }
    const itemIndex=userBasket.items.findIndex((p)=> p.productId===productId);
    if(itemIndex==undefined){
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
    fs.writeFileSync(Basket_path,JSON.stringify(baskets,null,2));
    return userBasket;
}
export const cleanBasket=(userId:number)=>{
    const file=fs.readFileSync(Basket_path,"utf-8");
    const baskets:Basket[]=JSON.parse(file);
    const userBasket=baskets.find((p) => p.userId===userId);
    if(userBasket==undefined){
        throw new Error("Корзина не найдена");
    }
    userBasket.items = [];
    fs.writeFileSync(Basket_path,JSON.stringify(userBasket,null,2));
    return userBasket;
}
