import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "./server.js";

describe("Task API - Practical 12 Automated Tests", () => {
  test("GET /tasks requires authentication (returns 401 without token)", async () => {
    const response = await request(app).get("/tasks");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication token required.",
    });
  });

  test("GET /health is public and returns 200", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: "Task API is running.",
    });
  });

  test("POST /register rejects requests with missing email or password", async () => {
    const response = await request(app)
      .post("/register")
      .send({ email: "" });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Validation failed.");
  });

  test("POST /api/ai/generate-description requires authentication", async () => {
    const response = await request(app)
      .post("/api/ai/generate-description")
      .send({ title: "Prepare quarterly sales report" });

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual({
      message: "Authentication token required.",
    });
  });
});
