"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const mongoose_1 = require("mongoose");
const AppError_1 = require("./AppError");
const errorHandler = (err, req, res, _next) => {
    if (err instanceof AppError_1.AppError) {
        return res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }
    // Mongoose Validation Error
    if (err instanceof mongoose_1.Error.ValidationError) {
        const messages = Object.values(err.errors).map((error) => error.message);
        return res.status(400).json({
            status: "error",
            message: messages.join(", "),
        });
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
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
exports.errorHandler = errorHandler;
