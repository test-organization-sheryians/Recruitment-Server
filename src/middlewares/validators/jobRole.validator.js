import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";

const createJobRoleSchema = Joi.object({
  title: Joi.string().min(3).max(100).required().messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is required",
  }),
  requiredExperience: Joi.string().min(1).max(50).required().messages({
    "string.min": "Required experience must be specified",
    "string.max": "Required experience cannot exceed 50 characters",
    "any.required": "Required experience is required",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Category must be a valid ObjectId",
    "any.required": "Category is required",
  }),
  education: Joi.string().min(3).max(100).required().messages({
    "string.min": "Education must be at least 3 characters long",
    "string.max": "Education cannot exceed 100 characters",
    "any.required": "Education is required",
  }),
  description: Joi.string().min(10).max(2000).required().messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
    "any.required": "Description is required",
  }),
  skills: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Each skill must be a valid ObjectId",
    })
  ).min(1).max(20).required().messages({
    "array.min": "At least one skill is required",
    "array.max": "Cannot have more than 20 skills",
    "any.required": "Skills are required",
  }),
  expiry: Joi.date().greater('now').required().messages({
    "date.greater": "Expiry date must be in the future",
    "any.required": "Expiry date is required",
  }),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
    "any.required": "Client ID is required",
  }),
});

const updateJobRoleSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title must be at least 3 characters long",
    "string.max": "Title cannot exceed 100 characters",
  }),
  requiredExperience: Joi.string().min(1).max(50).messages({
    "string.min": "Required experience must be specified",
    "string.max": "Required experience cannot exceed 50 characters",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Category must be a valid ObjectId",
  }),
  education: Joi.string().min(3).max(100).messages({
    "string.min": "Education must be at least 3 characters long",
    "string.max": "Education cannot exceed 100 characters",
  }),
  description: Joi.string().min(10).max(2000).messages({
    "string.min": "Description must be at least 10 characters long",
    "string.max": "Description cannot exceed 2000 characters",
  }),
  skills: Joi.array().items(
    Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
      "string.pattern.base": "Each skill must be a valid ObjectId",
    })
  ).min(1).max(20).messages({
    "array.min": "At least one skill is required",
    "array.max": "Cannot have more than 20 skills",
  }),
  expiry: Joi.date().greater('now').messages({
    "date.greater": "Expiry date must be in the future",
  }),
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
  }),
});

const filterJobRolesSchema = Joi.object({
  clientId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Client ID must be a valid ObjectId",
  }),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    "string.pattern.base": "Category must be a valid ObjectId",
  }),
  title: Joi.string().min(1).max(100).messages({
    "string.min": "Title filter must be at least 1 character long",
    "string.max": "Title filter cannot exceed 100 characters",
  }),
  expiry: Joi.string().valid('active', 'expired').messages({
    "any.only": "Expiry filter must be either 'active' or 'expired'",
  }),
});



const validateQuery = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.query, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const createJobRoleValidator = validate(createJobRoleSchema);
export const updateJobRoleValidator = validate(updateJobRoleSchema);
export const filterJobRolesValidator = validateQuery(filterJobRolesSchema);
