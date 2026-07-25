import type { RequestHandler } from "express";

import type { UserRole } from "../constants/roles.js";
import { AppError } from "../utils/app-error.js";

export function requireRoles(...roles: UserRole[]): RequestHandler {
  return (request, _response, next) => {
    if (!request.user) {
      next(new AppError(401, "AUTHENTICATION_REQUIRED", "Authentication is required."));
      return;
    }

    if (!roles.includes(request.user.role)) {
      next(
        new AppError(
          403,
          "INSUFFICIENT_PERMISSIONS",
          "You do not have permission to perform this action."
        )
      );
      return;
    }

    next();
  };
}
