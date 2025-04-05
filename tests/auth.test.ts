import request from "supertest";
import app from "../src/index";
import { User } from "../src/models/user.model";

describe("Authentication", () => {
  const testUser = {
    email: "test@example.com",
    password: "password123",
  };

  describe("POST /api/auth/register", () => {
    it("should register a new user", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
    }, 35000);

    it("should not register a user with existing email", async () => {
      // First registration
      await request(app).post("/api/auth/register").send(testUser);

      // Second registration with same email
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Email already in use");
    }, 35000);

    it("should validate required fields", async () => {
      const response = await request(app).post("/api/auth/register").send({});

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toContain("Email is required");
      expect(response.body.message).toContain("Password is required");
    }, 35000);
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user
      await request(app).post("/api/auth/register").send(testUser);
    }, 35000);

    it("should login with valid credentials", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send(testUser);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(response.body.token).toBeDefined();
      expect(response.body.data.user.email).toBe(testUser.email);
    }, 35000);

    it("should not login with invalid password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Invalid email or password");
    }, 35000);

    it("should not login with non-existent email", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "nonexistent@example.com",
        password: testUser.password,
      });

      expect(response.status).toBe(401);
      expect(response.body.status).toBe("fail");
      expect(response.body.message).toBe("Invalid email or password");
    }, 35000);
  });
});
