import type { RequestHandler } from "express";

export const notFoundMiddleware: RequestHandler = (request, _response, next) => {
  next({
    statusCode: 404,
    code: "ROUTE_NOT_FOUND",
    message: `Route ${request.method} ${request.originalUrl} was not found.`
  });
};
