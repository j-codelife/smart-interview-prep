import cors from "cors";
import express from "express";
import helmet from "helmet";

import { env } from "./config/env";
import { httpLogger } from "./lib/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import { healthRouter } from "./modules/health/health.routes";

/**
 * Builds the Express app without starting it. Kept separate from server.ts
 * so tests (Supertest) can import `app` and make requests against it
 * in-process, with no port bound and nothing to tear down.
 */
export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(httpLogger);

  app.use("/api/v1", healthRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export const app = createApp();
