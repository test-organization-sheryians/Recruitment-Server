import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";

const jobCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(62).required().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be at most 62 characters",
    "any.required": "Category name is required",
  }),
});

const updateJobCategorySchema = Joi.object({
  name: Joi.string().trim().min(2).max(62).optional().messages({
    "string.base": "Category name must be a string",
    "string.empty": "Category name is required",
    "string.min": "Category name must be at least 2 characters",
    "string.max": "Category name must be at most 62 characters",
  }),
});

export const createJobCategoryValidator = validate(jobCategorySchema);
export const updateJobCategoryValidator = validate(updateJobCategorySchema);
