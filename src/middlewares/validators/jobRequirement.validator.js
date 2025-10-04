import Joi from "joi";
import mongoose from "mongoose";
import { AppError } from "../../utils/errors.js";

const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }
  return value;
};

const experienceSchema = Joi.object({
  min: Joi.number().required().messages({
    "number.base": "Experience min must be a number",
    "any.required": "Experience min is required",
  }),
  max: Joi.number().required().messages({
    "number.base": "Experience max must be a number",
    "any.required": "Experience max is required",
  }),
}).custom((value, helpers) => {
  if (value.min > value.max) {
    return helpers.error("any.invalid", {
      message: "Experience min must be less than or equal to max",
    });
  }
  return value;
});

const createSchema = Joi.object({
  clientId: Joi.string()
    .required()
    .custom(objectIdValidator, "ObjectId")
    .messages({
      "any.required": "clientId is required",
      "any.invalid": "Invalid clientId",
    }),
  companyId: Joi.string()
    .required()
    .custom(objectIdValidator, "ObjectId")
    .messages({
      "any.required": "companyId is required",
      "any.invalid": "Invalid companyId",
    }),
  title: Joi.string()
    .required()
    .messages({ "any.required": "Title is required" }),
  description: Joi.string().allow(""),
  jobTitle: Joi.string().allow(""),
  experience: experienceSchema.required(),
  skills: Joi.array()
    .items(Joi.string().custom(objectIdValidator, "ObjectId"))
    .min(1)
    .required()
    .messages({
      "array.base": "Skills must be an array",
      "any.required": "Skills are required",
    }),
  location: Joi.array().items(Joi.string().required()).messages({
    "array.base": "Location must be array of strings",
  }),
  status: Joi.string().valid("open", "closed").required().messages({
    "any.only": "Status must be open or closed",
    "any.required": "Status is required",
  }),
});

const updateSchema = Joi.object({
  clientId: Joi.string().custom(objectIdValidator, "ObjectId"),
  companyId: Joi.string().custom(objectIdValidator, "ObjectId"),
  title: Joi.string(),
  description: Joi.string().allow(""),
  jobTitle: Joi.string().allow(""),
  experience: experienceSchema,
  skills: Joi.array().items(Joi.string().custom(objectIdValidator, "ObjectId")),
  location: Joi.array().items(Joi.string()),
  status: Joi.string().valid("open", "closed"),
});

// Middleware factory
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const msg = error.details.map((d) => d.message).join(", ");
    return next(new AppError(msg, 400));
  }
  next();
};

export const createJobRequirementValidator = validate(createSchema);
export const updateJobRequirementValidator = validate(updateSchema);
