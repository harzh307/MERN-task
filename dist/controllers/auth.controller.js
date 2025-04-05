"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user already exists
        const existingUser = yield user_model_1.User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: "fail",
                message: "Email already in use",
            });
        }
        // Create new user
        const user = yield user_model_1.User.create({ email, password });
        // Generate JWT token
        const payload = { id: user._id.toString(), email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
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
    }
    catch (error) {
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
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check if user exists
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }
        // Check if password is correct
        const isPasswordCorrect = yield user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                status: "fail",
                message: "Invalid email or password",
            });
        }
        // Generate JWT token
        const payload = { id: user._id.toString(), email: user.email };
        const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
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
    }
    catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error logging in",
        });
    }
});
exports.login = login;
