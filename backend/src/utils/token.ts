import jwt, {
  type JwtPayload,
  type SignOptions
} from "jsonwebtoken";

import { env } from "../config/env.js";
import type { AuthTokenPayload } from "../types/auth.types.js";

function getTokenExpiresIn(): NonNullable<SignOptions["expiresIn"]> {
  const value = env.AUTH_TOKEN_EXPIRES_IN.trim();

  if (value.length === 0) {
    throw new Error("AUTH_TOKEN_EXPIRES_IN cannot be empty");
  }

  return value as NonNullable<SignOptions["expiresIn"]>;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  const options: SignOptions = {
    expiresIn: getTokenExpiresIn()
  };

  return jwt.sign(payload, env.AUTH_TOKEN_SECRET, options);
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const decoded: string | JwtPayload = jwt.verify(
    token,
    env.AUTH_TOKEN_SECRET
  );

  if (
    typeof decoded === "string" ||
    typeof decoded.sub !== "string" ||
    !["customer", "vendor", "admin"].includes(decoded.role as string)
  ) {
    throw new Error("Invalid authentication token payload");
  }

  return {
    sub: decoded.sub,
    role: decoded.role as AuthTokenPayload["role"]
  };
}
