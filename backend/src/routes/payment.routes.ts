import { Router } from "express";
import { initializePayment, verifyPayment } from "../controllers/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.post("/initialize", initializePayment);
paymentRouter.get("/verify/:reference", verifyPayment);

export { paymentRouter };
