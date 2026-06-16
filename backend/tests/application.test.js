const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const userModel = require("../src/models/User");
const applicationModel = require("../src/models/Application");

let token;

afterAll(async () => {
  await applicationModel.deleteMany({ universityName: "mit" });
  await userModel.deleteOne({ email: "apptestuser@test.com" });
  await mongoose.connection.close();
});

beforeAll(async () => {
  await request(app).post("/api/auth/register").send({
    username: "apptestuser",
    email: "apptestuser@test.com",
    password: "password123",
    confirmPassword: "password123",
  });

  const res = await request(app).post("/api/auth/login").send({
    identifier: "apptestuser@test.com",
    password: "password123",
  });

  token = res.body.token;
});



describe("Application Routes", () => {
  test("POST /api/application/create — should create a new application", async () => {
    const res = await request(app)
      .post("/api/application/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        universityName: "MIT",
        country: "USA",
        programName: "Computer Science",
        applicationMethod: "PORTAL",
        applicationDate: "2026-09-01",
        status: "NOT_APPLIED",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("newApplication");
    expect(res.body.newApplication).toHaveProperty("universityName", "mit");
  });

  test("GET /api/application/me — should return user applications", async () => {
    const res = await request(app)
      .get("/api/application/me")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 404]).toContain(res.statusCode);
  });

  test("GET /api/application/me — should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/application/me");

    expect(res.statusCode).toBe(401);
  });
});