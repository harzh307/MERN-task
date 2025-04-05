import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";
import { AppError } from "./AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  // Mongoose Validation Error
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors).map((error) => error.message);
    return res.status(400).json({
      status: "error",
      message: messages.join(", "),
    });
  }

  // Mongoose duplicate key error
  if ((err as any).code === 11000) {
    return res.status(400).json({
      status: "error",
      message: "Email already in use",
    });
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      status: "error",
      message: "Invalid token. Please log in again!",
    });
  }

  // JWT Expired Error
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      status: "error",
      message: "Your token has expired! Please log in again.",
    });
  }

  // Default error
  console.error("ERROR 💥", err);

  if (process.env.NODE_ENV === "development") {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: err,
      stack: err.stack,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
};
