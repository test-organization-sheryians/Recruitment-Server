import EducationRepository from "../repositories/implementations/mongoEducationRepository.js";

class EducationService {
  constructor() {
    this.repo = new EducationRepository();
  }
  async create(data) { return this.repo.createEducation(data); }
  async getAll() { return this.repo.findAllEducations(); }
  async getById(id) { return this.repo.findEducationById(id); }
  async update(id, data) { return this.repo.updateEducation(id, data); }
  async delete(id) { return this.repo.deleteEducation(id); }
}
export default new EducationService();
