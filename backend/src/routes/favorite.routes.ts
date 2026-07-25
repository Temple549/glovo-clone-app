import { Router } from "express";
import { toggleFavorite, getFavorites } from "../controllers/favorite.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const favoriteRouter = Router();
favoriteRouter.use(requireAuth);

favoriteRouter.get("/", getFavorites);
favoriteRouter.post("/toggle", toggleFavorite);

export { favoriteRouter };
