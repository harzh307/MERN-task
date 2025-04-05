import express from "express";
import { register, login } from "../controllers/auth.controller";
import { errorHandler } from "../utils/errorHandler";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Error handling middleware
router.use(errorHandler);

export default router;
