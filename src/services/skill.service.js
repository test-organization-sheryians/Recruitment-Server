import MongoSkillRepository from "../repositories/implementations/mongoSkillRepository.js";
import { AppError } from "../utils/errors.js";

const skillRepo = new MongoSkillRepository();

class SkillService {
    async createSkill(data) {
        // Prevent duplicates proactively
        const existing = await skillRepo.findSkillByName(data.name);
        if (existing) {
            throw new AppError("Skill with this name already exists", 409);
        }
        return await skillRepo.createSkill(data);
    }

    async getSkillById(id) {
        const skill = await skillRepo.findSkillById(id);
        if (!skill) {
            throw new AppError("Skill not found", 404);
        }
        return skill;
    }

    async getAllSkills() {
        return await skillRepo.findAllSkills();
    }

    async updateSkill(id, data) {
        const updated = await skillRepo.updateSkill(id, data);
        if (!updated) {
            throw new AppError("Skill not found or update failed", 404);
        }
        return updated;
    }

    async deleteSkill(id) {
        const deleted = await skillRepo.deleteSkill(id);
        if (!deleted) {
            throw new AppError("Skill not found or delete failed", 404);
        }
        return deleted;
    }
}

export default new SkillService();
