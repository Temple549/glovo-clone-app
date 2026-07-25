import { Router } from "express";
import { createOrder, getMyOrders } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.post("/", createOrder);
orderRouter.get("/", getMyOrders);

export { orderRouter };
