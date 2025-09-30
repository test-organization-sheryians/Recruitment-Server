// src/repositories/implementation/mongoJobCategoryRepository.js

import IJobCategoryRepository from "../contracts/IJobCategoryRepository.js";
import JobCategory from "../../models/jobCategory.model.js";

class MongoJobCategoryRepository extends IJobCategoryRepository {
  async create(categoryData) {
    try {
      const category = new JobCategory(categoryData);
      return await category.save();
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Category name already exists" };
      }
      throw err;
    }
  }

  async findById(id) {
    return await JobCategory.findById(id);
  }

  async findByName(name) {
    return await JobCategory.findOne({ name });
  }

  async findAll() {
    return await JobCategory.find().sort({ name: 1 });
  }

  async updateById(id, updateData) {
    try {
      const updated = await JobCategory.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });
      return updated;
    } catch (err) {
      if (err.code === 11000) {
        throw { status: 400, message: "Category name already exists" };
      }
      throw err;
    }
  }

  async deleteById(id) {
    return await JobCategory.findByIdAndDelete(id);
  }
}

export default MongoJobCategoryRepository;
