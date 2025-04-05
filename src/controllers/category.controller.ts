import { Request, Response } from "express";
import mongoose from "mongoose";
import { Category, ICategory } from "../models/category.model";

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

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching category",
    });
  }
};
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parentId } = req.body;

    // Check if parent exists if parentId is provided
    if (parentId) {
      const parent = await Category.findById(parentId);
      if (!parent) {
        return res.status(404).json({
          status: "error",
          message: "Parent category not found",
        });
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
    res.status(500).json({
      status: "error",
      message: "Error creating category",
    });
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
    res.status(500).json({
      status: "error",
      message: "Error fetching categories",
    });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Update category
    if (name) category.name = name;
    if (status === "active" || status === "inactive") {
      category.status = status;
      // Update all child categories status
      await Category.updateMany({ parent: id }, { status });
    } else {
      return res.status(400).json({
        status: "error",
        message: "Invalid status",
      });
    }

    await category.save();

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error updating category",
    });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "Category not found",
      });
    }

    // Get parent category
    const parentId = category.parent;

    // Update all child categories to point to the parent's parent
    await Category.updateMany({ parent: id }, { parent: parentId });

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: {
        message: "Category deleted successfully",
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error deleting category",
    });
  }
};
