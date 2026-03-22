import { Delivery_path } from "../../constants/const";
import type { Delivery, DeliveryStatus, DeliveryView, PaymentMethod } from "../../types/delivery";
import { HttpError } from "../../utils/http-error";
import { readCollection, writeCollection } from "../../utils/store";
import { clearBasket, getBasket } from "../basket/basket.service";
import { getProductViewById, reserveProducts } from "../products/product.service";

type DeliveryPayload = {
    address: string;
    phone: string;
    email: string;
    paymentMethod: PaymentMethod;
};

function readDeliveries(): Delivery[] {
    return readCollection<Delivery>(Delivery_path);
}

function writeDeliveries(deliveries: Delivery[]): void {
    writeCollection<Delivery>(Delivery_path, deliveries);
}

function toDeliveryView(delivery: Delivery): DeliveryView {
    const items = delivery.items.map((item) => {
        const product = getProductViewById(item.productId);

        return {
            productId: item.productId,
            quantity: item.quantity,
            product,
            linePrice: product.price * item.quantity,
        };
    });

    return {
        ...delivery,
        items,
        active: delivery.status !== "delivered",
    };
}

export function listDeliveriesForUser(userId: number, status?: DeliveryStatus): DeliveryView[] {
    let deliveries = readDeliveries().filter((delivery) => delivery.userId === userId);

    if (status) {
        deliveries = deliveries.filter((delivery) => delivery.status === status);
    }

    deliveries.sort((left, right) => right.createdAt.localeCompare(left.createdAt));

    return deliveries.map(toDeliveryView);
}

export function createDeliveryForUser(userId: number, payload: DeliveryPayload): DeliveryView {
    const basket = getBasket(userId);

    if (basket.items.length === 0) {
        throw new HttpError(400, "Корзина пуста");
    }

    reserveProducts(basket.items);

    const deliveries = readDeliveries();
    const nextId = deliveries.length === 0 ? 1 : Math.max(...deliveries.map((delivery) => delivery.id)) + 1;
    const totalPrice = basket.items.reduce((sum, item) => {
        const product = getProductViewById(item.productId);
        return sum + product.price * item.quantity;
    }, 0);

    const newDelivery: Delivery = {
        id: nextId,
        userId,
        items: basket.items.map((item) => ({ ...item })),
        address: payload.address,
        phone: payload.phone,
        email: payload.email,
        paymentMethod: payload.paymentMethod,
        status: "processing",
        totalPrice,
        createdAt: new Date().toISOString(),
    };

    deliveries.push(newDelivery);
    writeDeliveries(deliveries);
    clearBasket(userId);

    return toDeliveryView(newDelivery);
}

export function updateUserDeliveryStatus(userId: number, deliveryId: number, status: DeliveryStatus): DeliveryView {
    const deliveries = readDeliveries();
    const delivery = deliveries.find((currentDelivery) => currentDelivery.id === deliveryId && currentDelivery.userId === userId);

    if (!delivery) {
        throw new HttpError(404, "Доставка не найдена");
    }

    delivery.status = status;
    writeDeliveries(deliveries);

    return toDeliveryView(delivery);
}
