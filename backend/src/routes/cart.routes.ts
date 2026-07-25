import { Router } from "express";
import { getCart, addToCart, clearCart } from "../controllers/cart.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const cartRouter = Router();
cartRouter.use(requireAuth);

cartRouter.get("/", getCart);
cartRouter.post("/items", addToCart);
cartRouter.delete("/", clearCart);

export { cartRouter };
