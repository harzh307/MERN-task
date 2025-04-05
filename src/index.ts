import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import categoryRoutes from "./routes/category.routes";
import { errorHandler } from "./utils/errorHandler";
import logger, { stream } from "./utils/logger";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// HTTP request logging
app.use(morgan("combined", { stream }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);

// Error handling
app.use(errorHandler);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-task")
  .then(() => {
    logger.info("Connected to MongoDB");
  })
  .catch((error) => {
    logger.error("MongoDB connection error:", error);
  });

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});

export default app;
