import mongoose from "mongoose";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD

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
    minlength: [2, "name must be at least 2 characters long"],
    maxlength: [25, "name cannot exceed 255 characters"]
  },

  startDate: { 
    type: String, 
    required: [true, "startDate is required"],
    validate: [
      {
        validator: value => dateRegex.test(value),
        message: "startDate must be in YYYY-MM-DD format"
      },
      {
        validator: value => !isNaN(Date.parse(value)),
        message: "startDate must be a valid date"
      }
    ]
  },

  endDate: { 
    type: String,
    validate: [
      {
        validator: value => !value || dateRegex.test(value),
        message: "endDate must be in YYYY-MM-DD format"
      },
      {
        validator: function(value) {
          if (!value) return true;
          return new Date(this.startDate) < new Date(value);
        },
        message: "endDate must be after or equal to startDate"
      }
    ]
  }

}, { 
  timestamps: true
});

const Education = mongoose.model("Education", EducationSchema);

export default Education;
