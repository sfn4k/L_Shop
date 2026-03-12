import fs from "fs";
import { Delivery } from "../types/delivery";
import {Delivery_path} from "../constants/const";
import { BasketItem } from "../types/basket";
import { getBasketById } from "./basket_service";
import { getProductsById } from "../services/product_service";

export const getAllDeliveries = () => {
    const delivers=fs.readFileSync(Delivery_path,"utf-8");
    const deliveries: Delivery[]=JSON.parse(delivers);
    return deliveries;
}
export const getDeliveriesById=(userId:number) => {
    const delivers=fs.readFileSync(Delivery_path,"utf-8");
    const deliveries: Delivery[]=JSON.parse(delivers);
    const deliver=deliveries.find(p=>p.userId===userId);
    if(deliver==undefined){
        throw new Error("Корзины такого пользователя не существует ")
    }
    return deliver;
}

export const putStatusDeliver = (userId: number, status: string) => {
    const delivers = fs.readFileSync(Delivery_path, "utf-8");
    const deliveries: Delivery[] = JSON.parse(delivers);
    const deliver = deliveries.find(p => p.userId === userId);
    if (deliver === undefined) {
        throw new Error("Доставка для данного пользователя не найдена");
    }
    deliver.status = status;
    fs.writeFileSync(Delivery_path, JSON.stringify(deliveries, null, 2));
    if (status === "выдано") {
        cleanDeliver(userId);
    }
    return deliver;
}
export const cleanDeliver = (userId:number)=>{
    const delivers=fs.readFileSync(Delivery_path,"utf-8");
    const deliveries: Delivery[]=JSON.parse(delivers);
    const deliver=deliveries.find(p=>p.userId===userId);
    if(deliver==undefined){
        throw new Error("Доставка для данного пользователя не найдена")
    }
    if(deliver.status.toLowerCase()=="выдано"){
        deliver.items=[];
        deliver.status="";
        fs.writeFileSync(Delivery_path,JSON.stringify(deliveries,null,2));
    }
    return deliver;
}
export const createDeliver = (userId: number, address: string, deliveryType: string, status: string) => {
    const delivers = fs.readFileSync(Delivery_path, "utf-8");
    const deliveries: Delivery[] = JSON.parse(delivers);
    const basket = getBasketById(userId);
    if (!basket) {
        throw new Error("Корзина пользователя не найдена");
    }
    if (basket.items.length === 0) {
        throw new Error("Корзина пустая");
    }
    let totalPrice = 0;
    basket.items.forEach(item => {
        const product = getProductsById(item.productId);
        if (!product) {
            throw new Error("Товар не найден");
        }
        totalPrice += product.price * item.quantity;
    });
    const nextId = deliveries.length + 1;
    const newDeliver: Delivery = {
        id: nextId,
        userId,
        items: basket.items,
        address,
        deliveryType,
        status,
        totalPrice
    };
    deliveries.push(newDeliver);
    fs.writeFileSync(Delivery_path, JSON.stringify(deliveries, null, 2));
    return newDeliver;
}




