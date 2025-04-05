"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const category_controller_1 = require("../controllers/category.controller");
const errorHandler_1 = require("../utils/errorHandler");
const router = express_1.default.Router();
// Protect all routes with authentication
router.use(auth_middleware_1.authenticate);
router.post("/", category_controller_1.createCategory);
router.get("/", category_controller_1.getCategories);
router.put("/:id", category_controller_1.updateCategory);
router.delete("/:id", category_controller_1.deleteCategory);
// Error handling middleware
router.use(errorHandler_1.errorHandler);
exports.default = router;
