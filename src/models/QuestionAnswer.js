import mongoose from './user.model';

const QuestionAnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    aitestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AITest",
      required: true,
    },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    aiFeedback: { type: String },
    result: {
      type: String,
      enum: ["correct", "partially-correct", "incorrect", "pending"],
      default: "pending",
    },
    points: { type: Number, default: 0 },
    maxPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.QuestionAnswer ||
  mongoose.model("QuestionAnswer", QuestionAnswerSchema);
