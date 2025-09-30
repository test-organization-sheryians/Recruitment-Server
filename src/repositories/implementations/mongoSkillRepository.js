import ISkillRepository from "../contracts/ISkillRepository.js";
import Skill from "../../models/skill.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoSkillRepository extends ISkillRepository {
  async createSkill(skillData) {
    try {
      const skill = new Skill(skillData);
      return await skill.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Skill name already exists", 409);
      }
      throw new AppError("Failed to create skill", 500);
    }
  }

  async findSkillById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Skill ID", 400);
    }
    try {
      return await Skill.findById(id).lean();
    } catch (error) {
      throw new AppError("Failed to find skill", 500);
    }
  }

  async findSkillByName(name) {
    try {
      return await Skill.findOne({ name: name.toLowerCase().trim() }).lean();
    } catch (error) {
      throw new AppError("Failed to find skill", 500);
    }
  }

  async findAllSkills() {
    try {
      return await Skill.find({}, { name: 1 }).sort({ name: 1 }).lean();
    } catch (error) {
      throw new AppError("Failed to fetch skills", 500);
    }
  }

  async updateSkill(id, skillData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Skill ID", 400);
    }
    try {
      return await Skill.findByIdAndUpdate(
        id,
        { name: skillData.name.toLowerCase().trim() },
        { new: true, runValidators: true }
      ).lean();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Skill name already exists", 409);
      }
      throw new AppError("Failed to update skill", 500);
    }
  }

  async deleteSkill(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid Skill ID", 400);
    }
    try {
      return await Skill.findByIdAndDelete(id).lean();
    } catch (error) {
      throw new AppError("Failed to delete skill", 500);
    }
  }
}

export default MongoSkillRepository;
