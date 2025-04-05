import { Request, Response } from "express";
import mongoose from "mongoose";
import { Category, ICategory } from "../models/category.model";
import { AppError } from "../utils/AppError";

// Helper function to build category tree
const buildCategoryTree = async (
  categories: ICategory[],
  parentId: mongoose.Types.ObjectId | null = null
) => {
  const tree: any[] = [];

  for (const category of categories) {
    if (category.parent?.toString() === parentId?.toString()) {
      const children = await buildCategoryTree(categories, category._id);
      if (children.length > 0) {
        category.children = children;
      }
      tree.push(category);
    }
  }

  return tree;
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;

    // Check if parent exists if parentId is provided
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        throw new AppError("Parent category not found", 404);
      }
    }

    const category = await Category.create({
      name,
      parent: parentId || null,
    });

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error creating category", 500);
  }
};

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    const categoryTree = await buildCategoryTree(categories);

    res.status(200).json({
      status: "success",
      data: {
        categories: categoryTree,
      },
    });
  } catch (error) {
    throw new AppError("Error fetching categories", 500);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Update category
    if (name) category.name = name;
    if (status) {
      category.status = status;
      // Update all child categories status
      await Category.updateMany({ parent: id }, { status });
    }

    await category.save();

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error updating category", 500);
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    // Get parent category
    const parentId = category.parent;

    // Update all child categories to point to the parent's parent
    await Category.updateMany({ parent: id }, { parent: parentId });

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Error deleting category", 500);
  }
};
