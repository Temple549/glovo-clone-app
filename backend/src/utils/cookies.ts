import type { Response } from "express";

import { AUTH_COOKIE_MAX_AGE_MS } from "../constants/auth.js";
import { env } from "../config/env.js";

export function setAuthCookie(response: Response, token: string): void {
  response.cookie(env.AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_COOKIE_MAX_AGE_MS,
    path: "/"
  });
}

export function clearAuthCookie(response: Response): void {
  response.clearCookie(env.AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });
}
