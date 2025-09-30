import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: ["create", "read", "update", "delete", "manage"]
  },
  roleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
    required: true,
    index: true
  }
}, {
  timestamps: true
});

permissionSchema.index({ resource: 1, action: 1, roleId: 1 });

export default mongoose.model("Permission", permissionSchema);
