import cors, { type CorsOptions } from "cors";

import { env } from "./env.js";



const corsOptions: CorsOptions = {
  origin: env.FRONTEND_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"]
};

export const corsMiddleware = cors(corsOptions);
