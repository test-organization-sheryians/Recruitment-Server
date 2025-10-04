import mongoose from "mongoose";

const jobRequirementSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true, "client id required"],
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "companyid required"],
    },
    title: { type: String, required: [true, "title is required"], trim: true },
    description: { type: String },
    jobTitle: { type: String },
    experience: {
      min: { type: Number, required: [true, "Minimum experience is required"] },
      max: { type: Number, required: [true, "Maximum experience is required"] },
    },
    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
        required: [true, "skill id is required"],
      },
    ],
    location: [{ type: String }],
    status: {
      type: String,
      enum: ["open", "closed"],
      required: [true, "status is required"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("JobRequirement", jobRequirementSchema);
