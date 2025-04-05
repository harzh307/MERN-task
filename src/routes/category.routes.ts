import express from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";
import { errorHandler } from "../utils/errorHandler";

const router = express.Router();

// Protect all routes with authentication
router.use(authenticate);

router.post("/", createCategory);
router.get("/", getCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

// Error handling middleware
router.use(errorHandler);

export default router;
