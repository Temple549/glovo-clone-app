import type { RequestHandler } from "express";
import { nanoid } from "nanoid";

export const requestIdMiddleware: RequestHandler = (request, response, next) => {
  const requestId = request.header("X-Request-ID") ?? nanoid(16);

  request.requestId = requestId;
  response.setHeader("X-Request-ID", requestId);

  next();
};
