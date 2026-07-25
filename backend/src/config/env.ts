import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  FRONTEND_URL: z.string().url("FRONTEND_URL must be a valid URL"),

  AUTH_COOKIE_NAME: z.string().min(1).default("food_delivery_session"),
  AUTH_TOKEN_SECRET: z
    .string()
    .min(32, "AUTH_TOKEN_SECRET must contain at least 32 characters"),
  AUTH_TOKEN_EXPIRES_IN: z.string().min(1).default("7d"),

  PAYSTACK_SECRET_KEY: z.string().optional(),
  PAYSTACK_PUBLIC_KEY: z.string().optional(),
  PAYSTACK_WEBHOOK_SECRET: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().optional(),

  SEED_CUSTOMER_PASSWORD: z.string().min(8).optional(),
SEED_VENDOR_PASSWORD: z.string().min(8).optional(),
SEED_ADMIN_PASSWORD: z.string().min(8).optional(),


  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info")
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid backend environment configuration:");
  console.error(parsedEnv.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsedEnv.data;
