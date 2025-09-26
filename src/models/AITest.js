import mongoose from "./user.model";

const AITestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true }, // e.g. "Frontend Interview"
    summary: { type: String },
    totalMarks: { type: Number, default: 0 },
    obtainedMarks: { type: Number, default: 0 },
    duration: { type: Number, default: 0 }, // minutes
    status: {
      type: String,
      enum: ["in-progress", "completed", "review"],
      default: "in-progress",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.AITest || mongoose.model("AITest", AITestSchema);
