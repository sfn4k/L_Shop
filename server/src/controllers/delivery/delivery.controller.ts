import type { Request, Response } from "express";

const { asyncHandler } = require("../../utils/async-handler");
const {
  createDeliveryForUser,
  listDeliveriesForUser,
  updateUserDeliveryStatus,
} = require("../../services/delivery/delivery.service");

type AuthenticatedRequest = import("../../middleware/auth.middleware").AuthenticatedRequest;
type DeliveryStatus = import("../../types/delivery").DeliveryStatus;
type PaymentMethod = import("../../types/delivery").PaymentMethod;

type DeliveryBody = {
  address?: string;
  phone?: string;
  email?: string;
  paymentMethod?: PaymentMethod;
};

type UpdateStatusBody = {
  status?: DeliveryStatus;
};

function isDeliveryStatus(value: unknown): value is DeliveryStatus {
  return value === "processing" || value === "paid" || value === "shipped" || value === "delivered";
}

function isPaymentMethod(value: unknown): value is PaymentMethod {
  return value === "card" || value === "cash";
}

export const getCurrentDeliveries = asyncHandler((req: AuthenticatedRequest, res: Response) => {
  const statusQuery = typeof req.query.status === "string" && isDeliveryStatus(req.query.status)
    ? req.query.status
    : undefined;

  res.json(listDeliveriesForUser(req.auth.userId, statusQuery));
});

export const createDelivery = asyncHandler((req: AuthenticatedRequest & { body: DeliveryBody }, res: Response) => {
  const { address, phone, email, paymentMethod } = req.body;

  if (!address || !phone || !email || !isPaymentMethod(paymentMethod)) {
    res.status(400).json({ message: "Нужно заполнить все поля доставки и выбрать способ оплаты" });
    return;
  }

  res.status(201).json(
    createDeliveryForUser(req.auth.userId, {
      address,
      phone,
      email,
      paymentMethod,
    })
  );
});

export const updateDeliveryStatus = asyncHandler((req: AuthenticatedRequest & Request<Record<string, never>, unknown, UpdateStatusBody>, res: Response) => {
  const deliveryId = Number(req.params.deliveryId);
  const status = req.body.status;

  if (!isDeliveryStatus(status)) {
    res.status(400).json({ message: "Передан некорректный статус доставки" });
    return;
  }

  res.json(updateUserDeliveryStatus(req.auth.userId, deliveryId, status));
});
