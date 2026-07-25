import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import { requireVendorRecord } from "../middleware/vendor.middleware.js";
import {
  getMyVendorProfile,
  updateMyVendorProfile,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/vendor-dashboard.controller.js";

const vendorDashboardRouter = Router();

// All routes here require being logged in as a vendor
vendorDashboardRouter.use(requireAuth, requireRoles("vendor"), requireVendorRecord);

vendorDashboardRouter.get("/profile", getMyVendorProfile);
vendorDashboardRouter.patch("/profile", updateMyVendorProfile);

vendorDashboardRouter.post("/products", createProduct);
vendorDashboardRouter.patch("/products/:productId", updateProduct);
vendorDashboardRouter.delete("/products/:productId", deleteProduct);

export { vendorDashboardRouter };
