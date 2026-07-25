import type { RequestHandler } from "express";

import { env } from "../config/env.js";
import { UserModel } from "../models/user.model.js";
import { AppError } from "../utils/app-error.js";
import { verifyAuthToken } from "../utils/token.js";

export const requireAuth: RequestHandler = async (
  request,
  _response,
  next
) => {
  try {
    const token = request.cookies?.[env.AUTH_COOKIE_NAME];

    if (typeof token !== "string" || token.length === 0) {
      next(new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."));
      return;
    }

    const payload = verifyAuthToken(token);
    const user = await UserModel.findById(payload.sub).lean();

    if (!user) {
      next(new AppError(401, "INVALID_SESSION", "The session is no longer valid."));
      return;
    }

    if (user.status !== "active") {
      next(new AppError(403, "ACCOUNT_SUSPENDED", "This account is not active."));
      return;
    }

    request.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    };

    next();
  } catch {
    next(new AppError(401, "INVALID_SESSION", "The session is invalid."));
  }
};
