const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const userModel = require("../src/models/User");

afterAll(async () => {
  await userModel.deleteOne({ email: "testuser123@test.com" });
  await mongoose.connection.close();
});
describe("Auth Routes", () => {
  const testUser = {
    username: "testuser123",
    email: "testuser123@test.com",
    password: "password123",
    confirmPassword: "password123",
  };

  test("POST /api/auth/register — should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(testUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("username", "testuser123");
  });

  test("POST /api/auth/login — should log in with email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: testUser.email, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login — should log in with username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: testUser.username, password: testUser.password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login — should reject wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ identifier: testUser.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
  });
});