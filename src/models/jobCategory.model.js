import mongoose from "mongoose";

const jobCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("JobCategory", jobCategorySchema);
