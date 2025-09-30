import Joi from "joi";
import { AppError } from "../../utils/errors.js";


const roleSchema = Joi.object({
  name: Joi.string().valid("admin", "candidate", "client").required().messages({
    "any.only": "Role name must be either admin, candidate, or client",
    "any.required": "Role name is required",
  }),
  description: Joi.string().required().messages({
    "any.required": "Role description is required",
  }),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

export const roleValidator = validate(roleSchema);
