import type { RequestHandler } from "express";
import crypto from "crypto";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";
import { OrderModel } from "../models/order.model.js";
import { UserModel } from "../models/user.model.js";
import { enqueueEmail } from "../queues/email.queue.js";
import { AppError } from "../utils/app-error.js";

export const paystackWebhook: RequestHandler = async (req, res, next) => {
  try {
    const signature = req.headers["x-paystack-signature"] as string | undefined;

    if (!env.PAYSTACK_WEBHOOK_SECRET || !signature) {
      logger.warn("Paystack webhook secret not configured or missing signature header");
      return res.status(400).send("Bad Request");
    }

    // Verify signature using HMAC-SHA512
    const expected = crypto
      .createHmac("sha512", env.PAYSTACK_WEBHOOK_SECRET)
      .update(req.rawBody || JSON.stringify(req.body))
      .digest("hex");

    if (expected !== signature) {
      logger.warn({ expected, signature }, "Invalid Paystack webhook signature");
      return res.status(401).send("Invalid signature");
    }

    const event = req.body;

    // Paystack event handling (transaction.success)
    if (event.event === "charge.success" || event.event === "transfer.success" || (event?.data?.status === "success")) {
      const reference = event?.data?.reference;
      if (!reference) {
        return res.status(400).send("Missing reference");
      }

      const order = await OrderModel.findOne({ paymentReference: reference });
      if (!order) {
        logger.warn({ reference }, "Order not found for webhook reference");
        return res.status(404).send("Order not found");
      }

      if (order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        await order.save();

        // Fetch customer email from User model
        const customer = await UserModel.findById(order.customerId).lean();
        if (customer) {
          void enqueueEmail(
            customer.email,
            "Payment received – order confirmed",
            `<p>Your payment for order ${order._id} was received. Your order is now confirmed.</p>`
          );
        }
      }
    }

    res.status(200).send("ok");
  } catch (error) {
    next(error);
  }
};
