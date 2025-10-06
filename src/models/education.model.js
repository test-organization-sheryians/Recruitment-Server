import mongoose from "mongoose";

const EducationSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: [true, "type is required"], 
    maxlength: [50, "type cannot exceed 50 characters"]
  },

  name: { 
    type: String, 
    required: [true, "name is required"],
    trim: true,
    minlength: [2, "name must be at least 2 characters"],
    maxlength: [255, "name cannot exceed 255 characters"]
  },

  startDate: { 
    type: Date, 
    required: [true, "startDate is required"],
    validate: {
      validator: function(value) {
        return !isNaN(Date.parse(value));
      },
      message: "startDate must be a valid ISO 8601 date (YYYY-MM-DD)"
    }
  },

  endDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        if (!value) return true;
        return this.startDate <= value;
      },
      message: "endDate must be after or equal to startDate"
    }
  }
}, { timestamps: true });

export default mongoose.model("Education", EducationSchema);
