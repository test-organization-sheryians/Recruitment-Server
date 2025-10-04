import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Companies" },
    emails: [{ type: String, required: true }],
    phone: { type: String, required: true },
    designation: { type: String },
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt & updatedAt
  }
);

export default mongoose.model("Client", clientSchema);
