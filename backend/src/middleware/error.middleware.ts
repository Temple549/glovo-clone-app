import type { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";

import { env } from "../config/env.js";
import { AppError } from "../utils/app-error.js";
import { logger } from "../utils/logger.js";

export const errorMiddleware: ErrorRequestHandler = (
  error,
  request,
  response,
  _next
) => {
  const requestId = request.requestId;

  if (error instanceof ZodError) {
    response.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: "The request contains invalid data.",
        details: error.flatten()
      },
      requestId
    });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    response.status(400).json({
      success: false,
      error: {
        code: "DATABASE_VALIDATION_ERROR",
        message: "The submitted data could not be saved."
      },
      requestId
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    response.status(400).json({
      success: false,
      error: {
        code: "INVALID_IDENTIFIER",
        message: "The supplied identifier is invalid."
      },
      requestId
    });
    return;
  }

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      logger.error({ err: error, requestId }, error.message);
    }

    response.status(error.statusCode).json({
      success: false,
      error: {
        code: error.code,
        message: error.message,
        ...(error.details === undefined ? {} : { details: error.details })
      },
      requestId
    });
    return;
  }

  logger.error({ err: error, requestId }, "Unhandled application error");

  response.status(500).json({
    success: false,
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message:
        env.NODE_ENV === "production"
          ? "An unexpected error occurred."
          : "An unexpected server error occurred."
    },
    requestId
  });
};
