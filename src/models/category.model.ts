import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parent: mongoose.Types.ObjectId | null;
  status: "active" | "inactive";
  children: mongoose.Types.ObjectId[];
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
categorySchema.index({ parent: 1 });
categorySchema.index({ status: 1 });

// Virtual for getting all descendants
categorySchema.virtual("descendants", {
  ref: "Category",
  localField: "_id",
  foreignField: "parent",
});

export const Category = mongoose.model<ICategory>("Category", categorySchema);
