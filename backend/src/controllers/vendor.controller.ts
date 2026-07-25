import type { RequestHandler } from "express";
import { VendorModel } from "../models/vendor.model.js";
import { ProductModel } from "../models/product.model.js";
import { AppError } from "../utils/app-error.js";

// Get all approved vendors
export const getVendors: RequestHandler = async (_req, res, next) => {
  try {
    const vendors = await VendorModel.find({
      approvalStatus: "approved",
      isOpen: true
    }).sort({ businessName: 1 });

    res.status(200).json({
      success: true,
      data: vendors
    });
  } catch (error) {
    next(error);
  }
};

// Get a single vendor by ID
export const getVendorById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendor = await VendorModel.findOne({
      _id: id,
      approvalStatus: "approved"
    });

    if (!vendor) {
      return next(new AppError(404, "VENDOR_NOT_FOUND", "Vendor not found or not approved."));
    }

    res.status(200).json({
      success: true,
      data: vendor
    });
  } catch (error) {
    next(error);
  }
};

// Get products for a specific vendor
export const getVendorProducts: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Check if id exists to satisfy TypeScript
    if (!id) {
      return next(new AppError(400, "INVALID_ID", "Vendor ID is required."));
    }

    const vendorExists = await VendorModel.exists({ _id: id, approvalStatus: "approved" });
    if (!vendorExists) {
      return next(new AppError(404, "VENDOR_NOT_FOUND", "Vendor not found or not approved."));
    }

    const products = await ProductModel.find({
      vendorId: id, // TypeScript now knows 'id' is a string
      isAvailable: true
    }).sort({ category: 1, name: 1 });

    res.status(200).json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
