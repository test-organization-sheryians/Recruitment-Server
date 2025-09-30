// src/controllers/jobCategory.controller.js

import JobCategoryService from "../services/jobCategory.service.js";

class JobCategoryController {
  constructor() {
    this.jobCategoryService = new JobCategoryService();
  }

  // CREATE
  create = async (req, res, next) => {
    try {
      const category = await this.jobCategoryService.createCategory(req.body);
      return res
        .status(201)
        .json({ success: true, data: category, message: "Category created" });
    } catch (err) {
      next(err);
    }
  };

  // LIST ALL
  list = async (req, res, next) => {
    try {
      const categories = await this.jobCategoryService.listCategories();
      return res.json({
        success: true,
        data: categories,
        message: "Categories fetched",
      });
    } catch (err) {
      next(err);
    }
  };

  // GET ONE
  get = async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await this.jobCategoryService.getCategoryById(id);
      return res.json({
        success: true,
        data: category,
        message: "Category fetched",
      });
    } catch (err) {
      next(err);
    }
  };

  // UPDATE
  update = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updated = await this.jobCategoryService.updateCategory(
        id,
        req.body
      );
      return res.json({
        success: true,
        data: updated,
        message: "Category updated",
      });
    } catch (err) {
      next(err);
    }
  };

  // DELETE
  delete = async (req, res, next) => {
    try {
      const { id } = req.params;
      await this.jobCategoryService.deleteCategory(id);
      return res.json({
        success: true,
        data: null,
        message: "Category deleted",
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new JobCategoryController();
