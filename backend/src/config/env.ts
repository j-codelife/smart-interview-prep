import { z } from "zod";

/**
 * Validates process.env at startup so the server fails fast with a clear
 * message instead of crashing (or misbehaving silently) later at request time.
 *
 * Only variables this phase of the app actually uses are validated here.
 * .env.example documents variables for later phases (DATABASE_URL,
 * JWT_SECRET, AI_*); they are added to this schema when the feature that
 * needs them is built.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // Thrown at import time, before the server starts listening.
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }

  return parsed.data;
}

export const env = loadEnv();
