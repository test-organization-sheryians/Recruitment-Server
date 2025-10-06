import MongoJobRequirementRepository from "../repositories/implementations/mongoJobRequirementRepository.js";
import { AppError } from "../utils/errors.js";

class JobRequirementService {
  constructor() {
    this.jobRequirementRepository = new MongoJobRequirementRepository();
  }

  async createRequirement(data) {
    return await this.jobRequirementRepository.create(data);
  }

  async getRequirementById(id) {
    const req = await this.jobRequirementRepository.findById(id);
    if (!req) throw new AppError("JobRequirement not found", 404);
    return req;
  }

  async listRequirements(filter = {}) {
    return await this.jobRequirementRepository.findAll(filter);
  }

  async updateRequirement(id, updateData) {
    const updated = await this.jobRequirementRepository.update(id, updateData);
    if (!updated) throw new AppError("JobRequirement not found", 404);
    return updated;
  }

  async deleteRequirement(id) {
    const deleted = await this.jobRequirementRepository.delete(id);
    if (!deleted) throw new AppError("JobRequirement not found", 404);
    return deleted;
  }

  async findByCompanyId(companyId) {
    return await this.jobRequirementRepository.findByCompanyId(companyId);
  }

  async findByStatus(status) {
    return await this.jobRequirementRepository.findByStatus(status);
  }
}

export default JobRequirementService;
