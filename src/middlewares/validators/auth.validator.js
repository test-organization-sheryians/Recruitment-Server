import Joi from "joi";
import validate from "../../utils/validateFnc.js";

const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(4).required().messages({
    "string.min": "Password must be at least 4 characters long",
    "any.required": "Password is required",
  }),
  firstName: Joi.string().required().messages({
    "any.required": "First name is required",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required",
  }),
  phoneNumber: Joi.string().min(10).required().messages({
    "string.min": "Phone number must be at least 10 digits long",
    "any.required": "Phone number is required",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email address is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

const resetPasswordSchema = Joi.object({
  oldPassword: Joi.string().required().messages({
    "any.required": "Old password is required",
    "string.empty": "Old password is required",
  }),
  newPassword: Joi.string().required().messages({
    "any.required": "New password is required",
    "string.empty": "New password is required",
  }),
});


export const registerValidator = validate(registerSchema);
export const loginValidator = validate(loginSchema);
export const resetPasswordValidator = validate(resetPasswordSchema);
