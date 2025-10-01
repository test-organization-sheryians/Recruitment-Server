import IEducationRepository from "../contracts/IEducationRepository.js";
import Education from "../../models/education.model.js";
import { AppError } from "../../utils/errors.js";

class MongoEducationRepository extends IEducationRepository {
  async createEducation(data) {
    try {
      const edu = new Education(data);
      return await edu.save();
    } catch (error) {
      throw new AppError("Failed to create education", 500);
    }
  }
  async findEducationById(id) {
    try {
      return await Education.findById(id);
    } catch (error) {
      throw new AppError("Failed to find education", 500);
    }
  }
  async findAllEducations() {
    try {
      return await Education.find();
    } catch (error) {
      throw new AppError("Failed to fetch educations", 500);
    }
  }
  async updateEducation(id, data) {
    try {
      return await Education.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    } catch (error) {
      throw new AppError("Failed to update education", 500);
    }
  }
  async deleteEducation(id) {
    try {
      return await Education.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete education", 500);
    }
  }
}
export default MongoEducationRepository;
