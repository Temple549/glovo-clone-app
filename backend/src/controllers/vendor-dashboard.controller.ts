import type { RequestHandler } from "express";
import { ProductModel } from "../models/product.model.js";
import { VendorModel } from "../models/vendor.model.js";
import { AppError } from "../utils/app-error.js";

// Get vendor's own profile
export const getMyVendorProfile: RequestHandler = async (req, res, next) => {
  try {
    const vendor = await VendorModel.findById(req.vendorId);
    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// Update vendor profile
export const updateMyVendorProfile: RequestHandler = async (req, res, next) => {
  try {
    const { businessName, description, address, cuisine, isOpen } = req.body;
    
    const vendor = await VendorModel.findByIdAndUpdate(
      req.vendorId,
      { $set: { businessName, description, address, cuisine, isOpen } },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// Create a product
export const createProduct: RequestHandler = async (req, res, next) => {
  try {
    const { name, description, price, category, imageUrl } = req.body;

    // Fixed: Guard check for vendorId to satisfy strict typing
    if (!req.vendorId) {
      return next(new AppError(403, "VENDOR_REQUIRED", "Vendor profile is required."));
    }

    const product = await ProductModel.create({
      vendorId: req.vendorId,
      name: name as string,
      description: description as string,
      price: Number(price),
      category: category as string,
      imageUrl: (imageUrl as string) ?? "",
      isAvailable: true
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Update a product (with ownership check)
export const updateProduct: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { vendorId } = req;
    const updateData = req.body;

    // Fixed: Guard check for IDs
    if (!productId || !vendorId) {
      return next(new AppError(400, "INVALID_REQUEST", "Product ID and Vendor ID are required."));
    }

    const product = await ProductModel.findOneAndUpdate(
      { _id: productId, vendorId: vendorId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return next(new AppError(404, "PRODUCT_NOT_FOUND", "Product not found or access denied."));
    }

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// Delete a product
export const deleteProduct: RequestHandler = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { vendorId } = req;

    // Fixed: Guard check for IDs
    if (!productId || !vendorId) {
      return next(new AppError(400, "INVALID_REQUEST", "Product ID and Vendor ID are required."));
    }

    const result = await ProductModel.deleteOne({ 
      _id: productId, 
      vendorId: vendorId 
    });

    if (result.deletedCount === 0) {
      return next(new AppError(404, "PRODUCT_NOT_FOUND", "Product not found or access denied."));
    }

    res.status(200).json({ success: true, message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
};
