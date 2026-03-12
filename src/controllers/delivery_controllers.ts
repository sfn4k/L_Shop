import { Request, Response } from "express";
import * as deliveryService from "../services/delivery_service";


export const getAllDeliveries = (req: Request, res: Response) => {
    const deliveries = deliveryService.getAllDeliveries();
    res.json(deliveries);
}


export const getDeliveriesByUser = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const deliveries = deliveryService.getDeliveriesById(userId);
    res.json(deliveries);
}

export const createDelivery = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const { address, deliveryType, status } = req.body;
    const delivery = deliveryService.createDeliver(
        userId,
        address,
        deliveryType,
        status
    );
    res.json(delivery);
}

export const updateDeliveryStatus = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const { status } = req.body;
    const delivery = deliveryService.putStatusDeliver(userId, status);
    res.json(delivery);
}

export const deleteDelivery = (req: Request, res: Response) => {
    const userId = Number(req.params.userId);
    const result = deliveryService.cleanDeliver(userId);
    res.json(result);
}
