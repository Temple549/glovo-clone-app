import type { RequestHandler } from "express";
import { VendorModel } from "../models/vendor.model.js";
import { AppError } from "../utils/app-error.js";

declare global {
  namespace Express {
    interface Request {
      vendorId?: string;
    }
  }
}

export const requireVendorRecord: RequestHandler = async (req, _res, next) => {
  try {
    const vendor = await VendorModel.findOne({ ownerId: req.user!.id });

    if (!vendor) {
      return next(new AppError(404, "VENDOR_RECORD_NOT_FOUND", "No vendor profile found for this account."));
    }

    if (vendor.approvalStatus !== "approved") {
      return next(new AppError(403, "VENDOR_NOT_APPROVED", "Your vendor account is pending approval or suspended."));
    }

    req.vendorId = vendor._id.toString();
    next();
  } catch (error) {
    next(error);
  }
};
