import { Request, Response } from "express";
import * as deliveryService from "../services/delivery_service";
import { AuthRequest } from "../midlware/midlware";
import { DeliveryStatus, PaymentMethod } from "../types/delivery";

export const getAllDeliveries = (req: Request, res: Response) => {
    const authReq = req as AuthRequest;
    const auth = authReq.auth;
    if (auth == undefined) {
        res.status(401).json({ message: "Требуется авторизация" });
        return;
    }
    let status: DeliveryStatus | undefined = undefined;
    if (req.query.status === "processing") {
        status = "processing";
    }
    if (req.query.status === "paid") {
        status = "paid";
    }
    if (req.query.status === "shipped") {
        status = "shipped";
    }
    if (req.query.status === "delivered") {
        status = "delivered";
    }
    const deliveries = deliveryService.getDeliveriesByUser(auth.userId, status);
    res.json(deliveries);
}

export const createDelivery = (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const auth = authReq.auth;
        if (auth == undefined) {
            res.status(401).json({ message: "Требуется авторизация" });
            return;
        }
        const address = req.body.address;
        const phone = req.body.phone;
        const email = req.body.email;
        const paymentMethod = req.body.paymentMethod;
        let currentPaymentMethod: PaymentMethod = "card";
        if (paymentMethod === "cash") {
            currentPaymentMethod = "cash";
        }
        const delivery = deliveryService.createDelivery(
            auth.userId,
            String(address),
            String(phone),
            String(email),
            currentPaymentMethod,
        );
        res.status(201).json(delivery);
    } catch (error) {
        let message = "Ошибка доставки";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(400).json({ message });
    }
}

export const updateDeliveryStatus = (req: Request, res: Response) => {
    try {
        const authReq = req as AuthRequest;
        const auth = authReq.auth;
        if (auth == undefined) {
            res.status(401).json({ message: "Требуется авторизация" });
            return;
        }
        const status = req.body.status;
        if (status !== "processing" && status !== "paid" && status !== "shipped" && status !== "delivered") {
            res.status(400).json({ message: "Некорректный статус" });
            return;
        }
        const delivery = deliveryService.updateDeliveryStatus(auth.userId, Number(req.params.deliveryId), status);
        res.json(delivery);
    } catch (error) {
        let message = "Ошибка доставки";
        if (error instanceof Error) {
            message = error.message;
        }
        res.status(400).json({ message });
    }
}

