import Joi from 'joi';

export const createJobApplicationSchema = Joi.object({
    candidateId: Joi.string().hex().length(24).required(),
    jobId: Joi.string().hex().length(24).required(),
    resumeFile: Joi.string().required(),
    resumeScore: Joi.number().optional(),
    status: Joi.string().valid('applied', 'shortlisted', 'rejected', 'forwarded', 'interview', 'hired').optional(),
    duplicateCheckHash: Joi.string().required(),
});

export const updateJobApplicationSchema = Joi.object({
    candidateId: Joi.string().hex().length(24),
    jobId: Joi.string().hex().length(24),
    resumeFile: Joi.string(),
    resumeScore: Joi.number(),
    status: Joi.string().valid('applied', 'shortlisted', 'rejected', 'forwarded', 'interview', 'hired'),
    duplicateCheckHash: Joi.string(),
}).min(1);

export const updateStatusSchema = Joi.object({
    status: Joi.string().valid('applied', 'shortlisted', 'rejected', 'forwarded', 'interview', 'hired').required(),
});
