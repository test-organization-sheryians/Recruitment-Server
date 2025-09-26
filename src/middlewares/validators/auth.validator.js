import Joi from "joi";
import { AppError } from "../../utils/errors.js";

// ✅ Register schema
const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long",
    "any.required": "Password is required",
  }),
  role: Joi.string().valid("Admin", "Candidate", "Client").required().messages({
    "any.only": "Role must be either Admin, Candidate, or Client",
    "any.required": "Role is required",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
  }),
phoneNumber: Joi.string()
  .min(10)
  .required()
  .messages({
    "string.min": "Phone number must be at least 10 digits long",
    "any.required": "Phone number is required",
  }),

 
});

// ✅ Login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

// ✅ Middleware wrapper
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    // Collect all errors as a single message
    return next(new AppError(error.details.map((d) => d.message).join(", "), 400));
  }
  next();
};

// ✅ Export middlewares
export const registerValidator = validate(registerSchema);
export const loginValidator = validate(loginSchema);
