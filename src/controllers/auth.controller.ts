import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/user.model";
import { AppError } from "../utils/AppError";

interface JwtPayload {
  id: string;
  email: string;
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "fail",
        message: "Email already in use",
      });
    }

    // Create new user
    const user = await User.create({ email, password });

    // Generate JWT token
    const payload: JwtPayload = { id: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return res.status(201).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      message: "Error creating user",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const payload: JwtPayload = { id: user._id.toString(), email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    return res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          id: user._id,
          email: user.email,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error logging in",
    });
  }
};
