// src/services/jobCategory.service.js

import MongoJobCategoryRepository from '../repositories/implementations/mongoJobCategoryRepository.js';
import { AppError } from '../utils/errors.js';

class JobCategoryService {
  constructor() {
    this.jobCategoryRepository = new MongoJobCategoryRepository();
  }

  async createCategory(data) {
    const exist = await this.jobCategoryRepository.findByName(data.name);
    if (exist) throw new AppError('Category name already exists', 400);

    return await this.jobCategoryRepository.create(data);
  }

  async listCategories() {
    return await this.jobCategoryRepository.findAll();
  }

  async getCategoryById(id) {
    const category = await this.jobCategoryRepository.findById(id);
    if (!category) throw new AppError('Category not found', 404);

    return category;
  }

  async updateCategory(id, data) {
    if (data.name) {
      const exist = await this.jobCategoryRepository.findByName(data.name);
      if (exist && exist._id.toString() !== id) {
        throw new AppError('Category name already exists', 400);
      }
    }

    const updated = await this.jobCategoryRepository.updateById(id, data);
    if (!updated) throw new AppError('Category not found', 404);

    return updated;
  }

  async deleteCategory(id) {
    const deleted = await this.jobCategoryRepository.deleteById(id);
    if (!deleted) throw new AppError('Category not found', 404);

    return deleted;
  }
}

export default new JobCategoryService();
