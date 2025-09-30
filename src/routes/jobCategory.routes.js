// src/routes/jobCategoryRoutes.js

import express from "express";
import jobCategoryController from "../controllers/jobCategory.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  createJobCategoryValidator,
  updateJobCategoryValidator,
} from "../middlewares/validators/jobCategory.validator.js";

const router = express.Router();

// CREATE (admin only) with validation
router.post(
  "/",
  authenticateJWT,

  createJobCategoryValidator, // <-- validation middleware
  jobCategoryController.create
);

// LIST ALL (public)
router.get("/", jobCategoryController.list);

// GET ONE (public)
router.get("/:id", jobCategoryController.get);

// UPDATE (admin only) with validation
router.put(
  "/:id",
  authenticateJWT,
  updateJobCategoryValidator, // <-- validation middleware
  jobCategoryController.update
);

// DELETE (admin only)
router.delete("/:id", authenticateJWT, jobCategoryController.delete);

export default router;
