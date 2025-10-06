import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";


const roleSchema = Joi.object({
  name: Joi.string().valid("admin", "candidate", "client").required().messages({
    "any.only": "Role name must be either admin, candidate, or client",
    "any.required": "Role name is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "Role description is required",
  }),
});

export const roleValidator = validate(roleSchema);
