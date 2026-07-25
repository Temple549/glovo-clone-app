import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { apiRouter } from "./routes/index.js";

import { corsMiddleware } from "./config/cors";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { requestIdMiddleware } from "./middleware/request-id.middleware";
import { logger } from "./utils/logger.js";
import cookieParser from "cookie-parser";



const app = express();

app.disable("x-powered-by");

app.use(requestIdMiddleware);
app.use(
  pinoHttp({
    logger,
    customProps: (request) => ({
      requestId: request.requestId
    })
  })
);
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());


app.get("/health", (_request, response) => {
  response.status(200).json({
    success: true,
    data: {
      status: "ok",
      service: "food-delivery-backend"
    }
  });
});

app.use("/api", apiRouter);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
