import skillService from "../services/skill.service.js";

class SkillController {
    async createSkill(req, res, next) {
        try {
            const skill = await skillService.createSkill(req.body);
            res.status(201).json({ success: true, data: skill });
        } catch (error) {
            next(error);
        }
    }

    async getSkill(req, res, next) {
        try {
            const skill = await skillService.getSkillById(req.params.id);
            res.status(200).json({ success: true, data: skill });
        } catch (error) {
            next(error);
        }
    }

    async getAllSkills(req, res, next) {
        try {
            const skills = await skillService.getAllSkills();
            res.status(200).json({ success: true, data: skills });
        } catch (error) {
            next(error);
        }
    }

    async updateSkill(req, res, next) {
        try {
            const updatedSkill = await skillService.updateSkill(req.params.id, req.body);
            res.status(200).json({ success: true, data: updatedSkill });
        } catch (error) {
            next(error);
        }
    }

    async deleteSkill(req, res, next) {
        try {
            await skillService.deleteSkill(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new SkillController();
