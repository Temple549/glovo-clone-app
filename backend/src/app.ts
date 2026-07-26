import express, { Request, Response } from "express";
import helmet from "helmet";
import {pinoHttp} from "pino-http";
import cookieParser from "cookie-parser";
import { IncomingMessage, ServerResponse } from "http";


// Note: Ensure all local imports use the .js extension for ESM compatibility in production
import { apiRouter } from "./routes/index.js";
import { corsMiddleware } from "./config/cors.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/not-found.middleware.js";
import { logger } from "./utils/logger.js";

const app = express();

app.disable("x-powered-by");

// 1. Request Tracking & Logging

app.use(
  pinoHttp({
    logger,
    // Fix 1: Use 'customProps' as suggested by the error message
    // Fix 2: Explicitly type 'req' and 'res' to fix the 'implicit any' error
    customProps: (req: Request, _res: Response) => ({
      requestId: (req as any).requestId
    })
  })
);


// 2. Security & Parsing Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(cookieParser());
// Capture raw body for webhook signature verification while still parsing JSON
app.use(
  express.json({
    limit: "1mb",
    verify: (req: any, _res, buf: Buffer) => {
      // store raw body buffer for later signature verification
      req.rawBody = buf;
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// 3. Render Health Check Routes
// This specific route handles the HEAD/GET requests Render sends to "/"
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Food Delivery API is live",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "food-delivery-backend"
    }
  });
});

// 4. API Routes
app.use("/api", apiRouter);

// 5. Error Handling (Only call these ONCE)
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
