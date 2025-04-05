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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategories = exports.createCategory = void 0;
const category_model_1 = require("../models/category.model");
const AppError_1 = require("../utils/AppError");
// Helper function to build category tree
const buildCategoryTree = (categories_1, ...args_1) => __awaiter(void 0, [categories_1, ...args_1], void 0, function* (categories, parentId = null) {
    var _a;
    const tree = [];
    for (const category of categories) {
        if (((_a = category.parent) === null || _a === void 0 ? void 0 : _a.toString()) === (parentId === null || parentId === void 0 ? void 0 : parentId.toString())) {
            const children = yield buildCategoryTree(categories, category._id);
            if (children.length > 0) {
                category.children = children;
            }
            tree.push(category);
        }
    }
    return tree;
});
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, parentId } = req.body;
        // Check if parent exists if parentId is provided
        if (parentId) {
            const parent = yield category_model_1.Category.findById(parentId);
            if (!parent) {
                throw new AppError_1.AppError("Parent category not found", 404);
            }
        }
        const category = yield category_model_1.Category.create({
            name,
            parent: parentId || null,
        });
        res.status(201).json({
            status: "success",
            data: {
                category,
            },
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        throw new AppError_1.AppError("Error creating category", 500);
    }
});
exports.createCategory = createCategory;
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.Category.find();
        const categoryTree = yield buildCategoryTree(categories);
        res.status(200).json({
            status: "success",
            data: {
                categories: categoryTree,
            },
        });
    }
    catch (error) {
        throw new AppError_1.AppError("Error fetching categories", 500);
    }
});
exports.getCategories = getCategories;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, status } = req.body;
        const category = yield category_model_1.Category.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        // Update category
        if (name)
            category.name = name;
        if (status) {
            category.status = status;
            // Update all child categories status
            yield category_model_1.Category.updateMany({ parent: id }, { status });
        }
        yield category.save();
        res.status(200).json({
            status: "success",
            data: {
                category,
            },
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        throw new AppError_1.AppError("Error updating category", 500);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield category_model_1.Category.findById(id);
        if (!category) {
            throw new AppError_1.AppError("Category not found", 404);
        }
        // Get parent category
        const parentId = category.parent;
        // Update all child categories to point to the parent's parent
        yield category_model_1.Category.updateMany({ parent: id }, { parent: parentId });
        // Delete the category
        yield category_model_1.Category.findByIdAndDelete(id);
        res.status(204).json({
            status: "success",
            data: null,
        });
    }
    catch (error) {
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        throw new AppError_1.AppError("Error deleting category", 500);
    }
});
exports.deleteCategory = deleteCategory;
