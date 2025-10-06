import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";

export const updateUserSchema = Joi.object({
  email: Joi.string().email().messages({
    "string.email": "A valid email address is required",
  }),
  password: Joi.string().min(4).messages({
    "string.min": "Password must be at least 4 characters long",
  }),
  firstName: Joi.string().messages({
    "string.base": "First name must be a string",
  }),
  lastName: Joi.string().messages({
    "string.base": "Last name must be a string",
  }),
  phoneNumber: Joi.string().min(10).messages({
    "string.min": "Phone number must be at least 10 digits long",
  }),
}).min(1); 


export const updateUserValidator = validate(updateUserSchema);
