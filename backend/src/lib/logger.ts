import pino from "pino";
import pinoHttp from "pino-http";

import { env } from "../config/env";

/**
 * Structured logger. Redaction is configured here, once, rather than left to
 * every call site to remember — so a logged request or error object can
 * never leak a password, cookie, or auth header.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "password",
      "passwordHash",
      "*.password",
      "*.passwordHash",
    ],
    censor: "[REDACTED]",
  },
  transport:
    env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } }
      : undefined,
});

/** Express middleware that logs one line per request/response with a request id. */
export const httpLogger = pinoHttp({
  logger,
  autoLogging: env.NODE_ENV !== "test",
});
