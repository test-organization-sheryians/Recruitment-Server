import Joi from "joi";
import { AppError } from "../../utils/errors.js";  

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


const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const message = error.details.map((d) => d.message).join(", ");
    return next(new AppError(message, 400));
  }
  next();
};


export const createJobCategoryValidator = validate(jobCategorySchema);
export const updateJobCategoryValidator = validate(updateJobCategorySchema);
