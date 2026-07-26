import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { vendorRouter } from "./vendor.routes.js";
import { favoriteRouter } from "./favorite.routes.js";
import { cartRouter } from "./cart.routes.js";
import { vendorDashboardRouter } from "./vendor-dashboard.routes.js";
import { orderRouter } from "./order.routes.js";
import { paymentRouter } from "./payment.routes.js";
import { publicPaymentRouter } from "./payment.routes.js";
import { checkoutRouter } from "./payment.routes.js";
import { adminRouter } from "./admin.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/vendors", vendorRouter);
apiRouter.use("/favorites", favoriteRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/vendor-dashboard", vendorDashboardRouter);
apiRouter.use("/orders", orderRouter);
apiRouter.use("/payments", paymentRouter);
// Public payment webhooks (no auth)
apiRouter.use(publicPaymentRouter);
// Unified checkout route (matches frontend expectations)
apiRouter.use("/checkout", checkoutRouter);
apiRouter.use("/admin", adminRouter);


export { apiRouter };
