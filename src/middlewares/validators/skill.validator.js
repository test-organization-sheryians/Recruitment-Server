import Joi from "joi"; 
import validate from "../../utils/validateFnc.js";

const createSkillSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
});

const updateSkillSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
});

export const updateSkillValidator = validate(updateSkillSchema);
export const createSkillValidator = validate(createSkillSchema);
