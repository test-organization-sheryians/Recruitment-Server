import Joi from "joi";

const createSkillSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
});

const updateSkillSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
});

export {
    createSkillSchema,
    updateSkillSchema,
};
