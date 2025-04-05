import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../src/utils/errorHandler";
import { AppError } from "../src/utils/AppError";
import { Error as MongooseError } from "mongoose";

describe("Error Handler", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  it("should handle AppError correctly", () => {
    const error = new AppError("Test error", 400);
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Test error",
    });
  });

  it("should handle Mongoose validation errors", () => {
    const validationError = new MongooseError.ValidationError();
    validationError.errors = {
      name: {
        message: "Name is required",
        name: "ValidatorError",
        properties: { message: "Name is required", path: "name", value: "" },
        kind: "required",
        path: "name",
        value: "",
      },
      email: {
        message: "Invalid email format",
        name: "ValidatorError",
        properties: {
          message: "Invalid email format",
          path: "email",
          value: "invalid",
        },
        kind: "regexp",
        path: "email",
        value: "invalid",
      },
    };

    errorHandler(
      validationError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Name is required, Invalid email format",
    });
  });

  it("should handle duplicate key errors", () => {
    const error = new Error("Duplicate key error") as any;
    error.code = 11000;
    error.keyValue = { email: "test@example.com" };

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Email already in use",
    });
  });

  it("should handle JWT errors", () => {
    const error = new Error("Invalid token") as any;
    error.name = "JsonWebTokenError";

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Invalid token. Please log in again!",
    });
  });

  it("should handle JWT expired errors", () => {
    const error = new Error("Token expired") as any;
    error.name = "TokenExpiredError";

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Your token has expired! Please log in again.",
    });
  });

  it("should handle unknown errors in production", () => {
    process.env.NODE_ENV = "production";
    const error = new Error("Unknown error");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Something went wrong!",
    });
  });

  it("should handle unknown errors in development", () => {
    process.env.NODE_ENV = "development";
    const error = new Error("Unknown error");

    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      status: "error",
      message: "Unknown error",
      error: error,
      stack: error.stack,
    });
  });
});
