import { Router } from "express";
import { authRateLimit } from "../middleware/rate-limit.middleware.js";

import {
  loginController,
  logoutController,
  meController,
  registerController
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateBody } from "../middleware/validate.middleware.js";
import {
  loginSchema,
  registerSchema
} from "../validators/auth.validators.js";

const authRouter = Router();

// Registration (rate-limited)
authRouter.post(
  "/register",
  authRateLimit,
  validateBody(registerSchema),
  registerController
);

// Login (rate-limited)
authRouter.post(
  "/login",
  authRateLimit,
  validateBody(loginSchema),
  loginController
);

authRouter.post("/logout", logoutController);

authRouter.get("/me", requireAuth, meController);

export { authRouter };
