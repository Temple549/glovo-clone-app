import { Router } from "express";
import { getVendors, getVendorById, getVendorProducts } from "../controllers/vendor.controller.js";

const vendorRouter = Router();

vendorRouter.get("/", getVendors);
vendorRouter.get("/:id", getVendorById);
vendorRouter.get("/:id/products", getVendorProducts);

export { vendorRouter };
