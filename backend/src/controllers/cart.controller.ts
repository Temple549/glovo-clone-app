import type { RequestHandler } from "express";
import { CartModel } from "../models/cart.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

export const getCart: RequestHandler = async (req, res, next) => {
  try {
    const cart = await CartModel.findOne({ userId: req.user!.id });
    res.status(200).json({ success: true, data: cart || { items: [], vendorId: null } });
  } catch (error) {
    next(error);
  }
};

export const addToCart: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { productId, quantity } = req.body;

    const product = await ProductModel.findById(productId);
    if (!product || !product.isAvailable) {
      return next(new AppError(404, "PRODUCT_UNAVAILABLE", "Product is not available."));
    }

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      cart = new CartModel({ userId, vendorId: product.vendorId, items: [] });
    }

    // Fixed: Ensure vendorId check handles the potentially undefined vendorId on new cart
    const currentVendorId = cart.vendorId?.toString();
    if (currentVendorId && currentVendorId !== product.vendorId.toString()) {
      return next(new AppError(409, "VENDOR_CONFLICT", "Your cart contains items from another vendor."));
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      const currentItem = cart.items[itemIndex];
      if (currentItem) {
        currentItem.quantity += (Number(quantity) || 1);
      }
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(quantity) || 1,
        // Fixed: Ensure imageUrl is never undefined for exactOptionalPropertyTypes
        imageUrl: product.imageUrl ?? "" 
      });
    }

    cart.vendorId = product.vendorId;
    await cart.save();

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart: RequestHandler = async (req, res, next) => {
  try {
    await CartModel.deleteOne({ userId: req.user!.id });
    res.status(200).json({ success: true, message: "Cart cleared." });
  } catch (error) {
    next(error);
  }
};
