import type { RequestHandler } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { OrderModel, type OrderItem } from "../models/order.model.js";
import { VendorModel } from "../models/vendor.model.js";
import { paystackClient } from "../integrations/paystack/paystack.client.js";
import { AppError } from "../utils/app-error.js";

/**
 * Unified checkout endpoint.
 * 1. Fetches the user's cart from the database
 * 2. Validates vendor & product availability
 * 3. Creates the order
 * 4. Initializes Paystack payment
 * 5. Returns the authorization URL
 */
export const checkout: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { deliveryAddress, customerContact } = req.body;

    // 1. Fetch Cart from DB (authoritative source)
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0 || !cart.vendorId) {
      return next(new AppError(400, "EMPTY_CART", "Your cart is empty."));
    }

    // 2. Validate Vendor Status
    const vendor = await VendorModel.findById(cart.vendorId);
    if (!vendor || !vendor.isOpen || vendor.approvalStatus !== "approved") {
      return next(
        new AppError(
          400,
          "VENDOR_UNAVAILABLE",
          "This vendor is currently not accepting orders."
        )
      );
    }

    // 3. Recalculate Totals & Create Snapshots (authoritative from DB)
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);

      if (!product || !product.isAvailable) {
        return next(
          new AppError(
            400,
            "PRODUCT_UNAVAILABLE",
            `Product "${item.name}" is no longer available.`
          )
        );
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        priceSnapshot: product.price,
        quantity: item.quantity,
        lineTotal,
      });
    }

    // 4. Final Calculations
    const deliveryFee = 500; // 5.00 in minor units
    const total = subtotal + deliveryFee;

    // 5. Create Order
    const order = await OrderModel.create({
      customerId: userId,
      vendorId: cart.vendorId,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      deliveryAddress,
      customerContact,
      orderStatus: "pending_payment",
      paymentStatus: "unpaid",
    });

    // 6. Clear Cart
    await CartModel.deleteOne({ userId });

    // 7. Initialize Paystack Payment
    const reference = `PAY_${order._id}_${Date.now()}`;

    const initialization = await paystackClient.initializeTransaction(
      req.user!.email,
      total,
      reference
    );

    // 8. Update order with payment reference
    order.paymentReference = reference;
    order.paymentStatus = "pending";
    await order.save();

    res.status(200).json({
      success: true,
      data: {
        authorization_url: initialization.authorization_url,
        reference,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify payment after user returns from Paystack.
 */
export const verifyCheckoutPayment: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { reference } = req.query as { reference?: string };

    if (!reference || typeof reference !== "string") {
      return next(
        new AppError(
          400,
          "REF_REQUIRED",
          "A valid payment reference is required."
        )
      );
    }

    const paystackData = await paystackClient.verifyTransaction(reference);

    if (paystackData.status !== "success") {
      return res.status(200).json({
        success: false,
        message: "Payment was not successful.",
        data: { status: paystackData.status },
      });
    }

    const order = await OrderModel.findOne({ paymentReference: reference });
    if (!order) {
      return next(
        new AppError(404, "ORDER_NOT_FOUND", "No order found for this reference.")
      );
    }

    // Prevent duplicate processing
    if (order.paymentStatus === "paid") {
      return res.status(200).json({
        success: true,
        data: { orderId: order._id.toString() },
        message: "Order already processed.",
      });
    }

    // Safety check: verify amount matches (Paystack amount is in kobo)
    if (paystackData.amount !== order.total) {
      return next(
        new AppError(
          400,
          "AMOUNT_MISMATCH",
          "Paid amount does not match order total."
        )
      );
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    await order.save();

    res.status(200).json({
      success: true,
      data: { orderId: order._id.toString() },
      message: "Payment verified and order confirmed.",
    });
  } catch (error) {
    next(error);
  }
};