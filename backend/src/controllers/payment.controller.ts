import type { RequestHandler } from "express";
import { OrderModel } from "../models/order.model.js";
import { paystackClient } from "../integrations/paystack/paystack.client.js";
import { AppError } from "../utils/app-error.js";

export const initializePayment: RequestHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    const order = await OrderModel.findOne({ _id: orderId, customerId: req.user!.id });

    if (!order) {
      return next(new AppError(404, "ORDER_NOT_FOUND", "Order not found."));
    }

    if (order.paymentStatus === "paid") {
      return next(new AppError(400, "ORDER_ALREADY_PAID", "This order has already been paid for."));
    }

    // Reference format: ORD_{timestamp}_{nanoid} or similar
    const reference = `PAY_${order._id}_${Date.now()}`;
    
    const initialization = await paystackClient.initializeTransaction(
      req.user!.email,
      order.total,
      reference
    );

    // Update order with the reference we generated
    order.paymentReference = reference;
    order.paymentStatus = "pending";
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        authorization_url: initialization.authorization_url,
        reference
      }
    });
  } catch (error) {
    next(error);
  }
};

export const verifyPayment: RequestHandler = async (req, res, next) => {
  try {
    const { reference } = req.params;

    // Fixed: Guard against missing or non-string reference
    if (!reference || typeof reference !== "string") {
      return next(new AppError(400, "REF_REQUIRED", "A valid payment reference is required."));
    }

    const paystackData = await paystackClient.verifyTransaction(reference);

    if (paystackData.status !== "success") {
      return res.status(200).json({
        success: false,
        message: "Payment was not successful.",
        data: { status: paystackData.status }
      });
    }

    const order = await OrderModel.findOne({ paymentReference: reference });
    if (!order) {
      return next(new AppError(404, "ORDER_NOT_FOUND", "No order found for this reference."));
    }

    // Prevent duplicate processing
    if (order.paymentStatus === "paid") {
      return res.status(200).json({ 
        success: true, 
        data: order, 
        message: "Order already processed." 
      });
    }

    // Safety check: verify amount matches (Paystack amount is in kobo)
    if (paystackData.amount !== order.total) {
      return next(new AppError(400, "AMOUNT_MISMATCH", "Paid amount does not match order total."));
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    res.status(200).json({
      success: true,
      data: order,
      message: "Payment verified and order confirmed."
    });
  } catch (error) {
    next(error);
  }
};
