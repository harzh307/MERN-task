import request from "supertest";
import app from "../src/index";
import { Category } from "../src/models/category.model";

describe("Category Management", () => {
  let authToken: string;

  beforeEach(async () => {
    // Register and login a user
    const testUser = {
      email: "test@example.com",
      password: "password123",
    };

    await request(app).post("/api/auth/register").send(testUser);

    const loginResponse = await request(app)
      .post("/api/auth/login")
      .send(testUser);

    authToken = loginResponse.body.token;
  });

  describe("POST /api/category", () => {
    it("should create a new category", async () => {
      const response = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Test Category" })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.name).toBe("Test Category");
      expect(response.body.data.category.status).toBe("active");
    });

    it("should create a nested category", async () => {
      // Create parent category
      const parentResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Parent Category" });

      // Create child category
      const response = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Child Category",
          parentId: parentResponse.body.data.category._id,
        })
        .expect(201);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.name).toBe("Child Category");
      expect(response.body.data.category.parent).toBe(
        parentResponse.body.data.category._id
      );
    });
  });

  describe("GET /api/category", () => {
    it("should get categories in tree structure", async () => {
      // Create parent category
      const parentResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Parent Category" });

      // Create child category
      await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Child Category",
          parentId: parentResponse.body.data.category._id,
        });

      const response = await request(app)
        .get("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.categories).toHaveLength(1);
      expect(response.body.data.categories[0].children).toHaveLength(1);
    });
  });

  describe("PUT /api/category/:id", () => {
    it("should update category name", async () => {
      // Create category
      const createResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Test Category" });

      const response = await request(app)
        .put(`/api/category/${createResponse.body.data.category._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Updated Category" })
        .expect(200);

      expect(response.body.status).toBe("success");
      expect(response.body.data.category.name).toBe("Updated Category");
    });

    it("should update category status and propagate to children", async () => {
      // Create parent category
      const parentResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Parent Category" });

      // Create child category
      await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Child Category",
          parentId: parentResponse.body.data.category._id,
        });

      // Update parent status
      await request(app)
        .put(`/api/category/${parentResponse.body.data.category._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: "inactive" });

      // Check child status
      const categories = await Category.find();
      const childCategory = categories.find(
        (cat) => cat.name === "Child Category"
      );
      expect(childCategory?.status).toBe("inactive");
    });
  });

  describe("DELETE /api/category/:id", () => {
    it("should delete category and reassign children", async () => {
      // Create grandparent category
      const grandparentResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ name: "Grandparent Category" });

      // Create parent category
      const parentResponse = await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Parent Category",
          parentId: grandparentResponse.body.data.category._id,
        });

      // Create child category
      await request(app)
        .post("/api/category")
        .set("Authorization", `Bearer ${authToken}`)
        .send({
          name: "Child Category",
          parentId: parentResponse.body.data.category._id,
        });

      // Delete parent category
      await request(app)
        .delete(`/api/category/${parentResponse.body.data.category._id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(204);

      // Check child category's new parent
      const categories = await Category.find();
      const childCategory = categories.find(
        (cat) => cat.name === "Child Category"
      );
      expect(childCategory?.parent?.toString()).toBe(
        grandparentResponse.body.data.category._id
      );
    });
  });
});
