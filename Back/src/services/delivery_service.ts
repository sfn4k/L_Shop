import fs from "fs";
import { BasketItemView } from "../types/basket";
import { Delivery, DeliveryStatus, DeliveryView, PaymentMethod } from "../types/delivery";
import {Delivery_path} from "../constants/const";
import { cleanBasket, getBasketById } from "./basket_service";
import { getProductViewById } from "./product_service";

const readDeliveryFile = (): Delivery[] => {
    if (!fs.existsSync(Delivery_path)) {
        return [];
    }

    const file = fs.readFileSync(Delivery_path, "utf-8").trim();

    if (!file) {
        return [];
    }

    const deliveries: Delivery[] = JSON.parse(file);
    return deliveries;
}

const writeDeliveryFile = (deliveries: Delivery[]) => {
    fs.writeFileSync(Delivery_path, JSON.stringify(deliveries, null, 2));
}

export const getAllDeliveries = () => {
    const deliveries = readDeliveryFile();
    return deliveries;
}

export const getDeliveriesByUser = (userId: number, status?: DeliveryStatus): DeliveryView[] => {
    const deliveries = readDeliveryFile();
    const userDeliveries: Delivery[] = [];
    for (const delivery of deliveries) {
        if (delivery.userId !== userId) {
            continue;
        }
        if (status != undefined && delivery.status !== status) {
            continue;
        }
        userDeliveries.push(delivery);
    }
    userDeliveries.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const result: DeliveryView[] = [];
    for (const delivery of userDeliveries) {
        const items: BasketItemView[] = [];
        for (const item of delivery.items) {
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
        result.push({
            id: delivery.id,
            userId: delivery.userId,
            items: items,
            address: delivery.address,
            phone: delivery.phone,
            email: delivery.email,
            paymentMethod: delivery.paymentMethod,
            status: delivery.status,
            totalPrice: delivery.totalPrice,
            createdAt: delivery.createdAt,
            active: delivery.status !== "delivered",
        });
    }
    return result;
}

export const createDelivery = (
    userId: number,
    address: string,
    phone: string,
    email: string,
    paymentMethod: PaymentMethod,
) => {
    const deliveries = readDeliveryFile();
    const basket = getBasketById(userId);

    if (!basket || basket.items.length === 0) {
        throw new Error("Корзина пуста");
    }

    let totalPrice = 0;
    for (const item of basket.items) {
        const product = getProductViewById(item.productId);
        if (!product) {
            throw new Error("Товар не найден");
        }
        totalPrice += product.price * item.quantity;
    }
    let nextId = 1;
    if (deliveries.length > 0) {
        let maxId = deliveries[0].id;
        for (const delivery of deliveries) {
            if (delivery.id > maxId) {
                maxId = delivery.id;
            }
        }
        nextId = maxId + 1;
    }
    const items = [];
    for (const item of basket.items) {
        items.push({
            productId: item.productId,
            quantity: item.quantity,
        });
    }

    const newDelivery: Delivery = {
        id: nextId,
        userId,
        items,
        address,
        phone,
        email,
        paymentMethod,
        status: "processing",
        totalPrice,
        createdAt: new Date().toISOString(),
    };

    deliveries.push(newDelivery);
    writeDeliveryFile(deliveries);
    cleanBasket(userId);
    const deliveryItems: BasketItemView[] = [];
    for (const item of newDelivery.items) {
        const product = getProductViewById(item.productId);
        if (product == undefined) {
            continue;
        }
        deliveryItems.push({
            productId: item.productId,
            quantity: item.quantity,
            linePrice: product.price * item.quantity,
            product: product,
        });
    }
    return {
        id: newDelivery.id,
        userId: newDelivery.userId,
        items: deliveryItems,
        address: newDelivery.address,
        phone: newDelivery.phone,
        email: newDelivery.email,
        paymentMethod: newDelivery.paymentMethod,
        status: newDelivery.status,
        totalPrice: newDelivery.totalPrice,
        createdAt: newDelivery.createdAt,
        active: newDelivery.status !== "delivered",
    };
}

export const updateDeliveryStatus = (userId: number, deliveryId: number, status: DeliveryStatus) => {
    const deliveries = readDeliveryFile();
    const delivery = deliveries.find((item) => item.userId === userId && item.id === deliveryId);

    if (!delivery) {
        throw new Error("Доставка не найдена");
    }
    delivery.status = status;
    writeDeliveryFile(deliveries);
    const items: BasketItemView[] = [];
    for (const item of delivery.items) {
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
    return {
        id: delivery.id,
        userId: delivery.userId,
        items: items,
        address: delivery.address,
        phone: delivery.phone,
        email: delivery.email,
        paymentMethod: delivery.paymentMethod,
        status: delivery.status,
        totalPrice: delivery.totalPrice,
        createdAt: delivery.createdAt,
        active: delivery.status !== "delivered",
    };
}

