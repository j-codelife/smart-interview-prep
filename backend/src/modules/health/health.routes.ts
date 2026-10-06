import { Router } from "express";

export const healthRouter = Router();

/**
 * Liveness check. Once Postgres exists (chore/database), this will also
 * verify the DB connection so a broken deploy shows up here instead of as a
 * mystery 500 on the first real request.
 */
healthRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});
