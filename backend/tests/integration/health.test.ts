import request from "supertest";
import { describe, expect, it } from "vitest";

import { app } from "../../src/app";

describe("GET /api/v1/health", () => {
  it("returns 200 with an ok status", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
    expect(typeof res.body.timestamp).toBe("string");
  });
});

describe("unmatched routes", () => {
  it("returns a 404 in the standard error shape", async () => {
    const res = await request(app).get("/api/v1/does-not-exist");

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });
});
