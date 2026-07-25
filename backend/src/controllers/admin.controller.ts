import type { RequestHandler } from "express";
import { UserModel } from "../models/user.model.js";
import { VendorModel } from "../models/vendor.model.js";
import { OrderModel } from "../models/order.model.js";
import { AppError } from "../utils/app-error.js";

// --- User Management ---

export const getAllUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await UserModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['active', 'suspended'].includes(status)) {
      return next(new AppError(400, "INVALID_STATUS", "Status must be active or suspended."));
    }

    const user = await UserModel.findByIdAndUpdate(userId, { status }, { new: true });
    if (!user) return next(new AppError(404, "USER_NOT_FOUND", "User not found."));

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// --- Vendor Management ---

export const getAllVendors: RequestHandler = async (_req, res, next) => {
  try {
    const vendors = await VendorModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: vendors });
  } catch (error) {
    next(error);
  }
};

export const updateVendorApproval: RequestHandler = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { approvalStatus } = req.body;

    if (!['pending', 'approved', 'suspended'].includes(approvalStatus)) {
      return next(new AppError(400, "INVALID_STATUS", "Invalid approval status."));
    }

    const vendor = await VendorModel.findByIdAndUpdate(vendorId, { approvalStatus }, { new: true });
    if (!vendor) return next(new AppError(404, "VENDOR_NOT_FOUND", "Vendor not found."));

    res.status(200).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

// --- Global Order Management ---

export const getAllOrders: RequestHandler = async (_req, res, next) => {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("customerId", "name email")
      .populate("vendorId", "businessName");
      
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    next(error);
  }
};
