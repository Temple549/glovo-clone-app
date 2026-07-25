import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { vendorRouter } from "./vendor.routes.js";
import { favoriteRouter } from "./favorite.routes.js";
import { cartRouter } from "./cart.routes.js";
import { vendorDashboardRouter } from "./vendor-dashboard.routes.js";
import { orderRouter } from "./order.routes.js"; // New
import { paymentRouter } from "./payment.routes.js";
import { adminRouter } from "./admin.routes.js";

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/vendors", vendorRouter);
apiRouter.use("/favorites", favoriteRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/vendor-dashboard", vendorDashboardRouter);
apiRouter.use("/orders", orderRouter); // New
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/admin", adminRouter);


export { apiRouter };
