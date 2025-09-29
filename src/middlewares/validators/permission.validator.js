import Joi from "joi";
import { AppError } from "../../utils/errors.js";

//Permission schema
const permissionSchema = Joi.object({
  resource: Joi.string().required().messages({
    "any.required": "Resource name is required",
  }),
  action: Joi.string()
    .valid("create", "read", "update", "delete", "manage")
    .required()
    .messages({
      "any.only": "Action must be one of create, read, update, delete, or manage",
      "any.required": "Action is required",
    }),
  roleId: Joi.string().required().messages({
    "any.required": "RoleId is required",
  }),
});

//Middleware wrapper
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }
  next();
};

//Export middleware
export const permissionValidator = validate(permissionSchema);
