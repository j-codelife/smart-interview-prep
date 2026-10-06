import type { NextFunction, Request, Response } from "express";

import { logger } from "../lib/logger";
import { AppError } from "../utils/errors";

/** 404 handler for routes that don't match anything — runs after all routes. */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, "NOT_FOUND", `No route for ${req.method} ${req.originalUrl}`));
}

/**
 * Single place that turns any thrown error into the API's error response
 * shape. Known AppErrors pass their status/code/details through; anything
 * else (a bug, a library throwing) is logged with its stack and returned as
 * a generic 500 so internals never leak to the client.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, err.message);
    }
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
      },
    });
    return;
  }

  logger.error({ err }, "Unhandled error");
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Something went wrong",
    },
  });
}
