import type { RequestHandler } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { OrderModel, type OrderItem } from "../models/order.model.js";
import { VendorModel } from "../models/vendor.model.js";
import { AppError } from "../utils/app-error.js";

export const createOrder: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { deliveryAddress, customerContact } = req.body;

    // 1. Fetch Cart
    const cart = await CartModel.findOne({ userId });
    if (!cart || cart.items.length === 0 || !cart.vendorId) {
      return next(new AppError(400, "EMPTY_CART", "Your cart is empty."));
    }

    // 2. Validate Vendor Status
    const vendor = await VendorModel.findById(cart.vendorId);
    if (!vendor || !vendor.isOpen || vendor.approvalStatus !== 'approved') {
      return next(new AppError(400, "VENDOR_UNAVAILABLE", "This vendor is currently not accepting orders."));
    }

    // 3. Recalculate Totals & Create Snapshots
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = await ProductModel.findById(item.productId);
      
      if (!product || !product.isAvailable) {
        return next(new AppError(400, "PRODUCT_UNAVAILABLE", `Product ${item.name} is no longer available.`));
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      orderItems.push({
        productId: product._id,
        nameSnapshot: product.name,
        priceSnapshot: product.price,
        quantity: item.quantity,
        lineTotal
      });
    }

    // 4. Final Calculations (Fixed delivery fee for now)
    const deliveryFee = 500; // e.g., 5.00 in minor units
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
      orderStatus: 'pending_payment',
      paymentStatus: 'unpaid'
    });

    // 6. Clear Cart after successful order creation
    await CartModel.deleteOne({ userId });

    res.status(201).json({
      success: true,
      data: order,
      message: "Order initiated. Please proceed to payment."
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ customerId: req.user!.id })
      .sort({ createdAt: -1 })
      .populate("vendorId", "businessName logoUrl");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
