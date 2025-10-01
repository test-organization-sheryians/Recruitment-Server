import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  type: { type: String, required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date }
}, { timestamps: true });

export default mongoose.model("Education", EducationSchema);
