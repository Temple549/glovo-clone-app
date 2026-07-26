import { Router } from "express";
import { initializePayment, verifyPayment } from "../controllers/payment.controller.js";
import { checkout, verifyCheckoutPayment } from "../controllers/checkout.controller.js";
import { paystackWebhook } from "../controllers/paystack.webhook.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const paymentRouter = Router();

paymentRouter.use(requireAuth);

paymentRouter.post("/initialize", initializePayment);
paymentRouter.get("/verify/:reference", verifyPayment);

// Public webhook endpoint (Paystack posts here). Raw body is captured at app level.
const publicPaymentRouter = Router();
publicPaymentRouter.post("/webhook/paystack", paystackWebhook);

// Unified checkout router (mounted at /checkout in index.ts)
const checkoutRouter = Router();
checkoutRouter.use(requireAuth);
checkoutRouter.post("/pay", checkout);
checkoutRouter.get("/verify", verifyCheckoutPayment);

export { publicPaymentRouter, checkoutRouter };

export { paymentRouter };
