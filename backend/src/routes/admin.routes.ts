import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import {
  getAllUsers,
  updateUserStatus,
  getAllVendors,
  updateVendorApproval,
  getAllOrders
} from "../controllers/admin.controller.js";

const adminRouter = Router();

// Apply admin-only protection to all routes in this file
adminRouter.use(requireAuth, requireRoles("admin"));

// Users
adminRouter.get("/users", getAllUsers);
adminRouter.patch("/users/:userId/status", updateUserStatus);

// Vendors
adminRouter.get("/vendors", getAllVendors);
adminRouter.patch("/vendors/:vendorId/approval", updateVendorApproval);

// Orders
adminRouter.get("/orders", getAllOrders);

export { adminRouter };
