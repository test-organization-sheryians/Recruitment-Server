import Joi from "joi";

export const educationSchema = Joi.object({
  type: Joi.string().required(  ),
  name: Joi.string().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().optional()
});
