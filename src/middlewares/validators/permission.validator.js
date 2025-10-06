import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";

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

export const permissionValidator = validate(permissionSchema);
