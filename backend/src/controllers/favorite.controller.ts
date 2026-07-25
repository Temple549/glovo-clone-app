import type { RequestHandler } from "express";
import { FavoriteModel } from "../models/favorite.model.js";
import { AppError } from "../utils/app-error.js";

export const toggleFavorite: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const { vendorId, productId } = req.body;

    if (!vendorId && !productId) {
      return next(new AppError(400, "INVALID_INPUT", "Either vendorId or productId must be provided."));
    }

    const query = { userId, vendorId, productId };
    const existing = await FavoriteModel.findOne(query);

    if (existing) {
      await FavoriteModel.deleteOne({ _id: existing._id });
      return res.status(200).json({ success: true, message: "Removed from favorites." });
    }

    await FavoriteModel.create(query);
    res.status(201).json({ success: true, message: "Added to favorites." });
  } catch (error) {
    next(error);
  }
};

export const getFavorites: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user!.id;
    const favorites = await FavoriteModel.find({ userId })
      .populate("vendorId", "businessName logoUrl cuisine")
      .populate("productId", "name price imageUrl isAvailable");

    res.status(200).json({ success: true, data: favorites });
  } catch (error) {
    next(error);
  }
};
