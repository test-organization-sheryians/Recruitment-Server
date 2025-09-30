import express from "express";
import jobCategoryController from "../controllers/jobCategory.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import {
  createJobCategoryValidator,
  updateJobCategoryValidator,
} from "../middlewares/validators/jobCategory.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/",
  authorize("jobs", "create"),
  createJobCategoryValidator,
  jobCategoryController.create
);

router.get("/", jobCategoryController.list);

router.get("/:id", jobCategoryController.get);

router.put(
  "/:id",
  authorize("jobs", "update"),
  updateJobCategoryValidator,
  jobCategoryController.update
);

router.delete(
  "/:id",
  authorize("jobs", "delete"),
  jobCategoryController.delete
);

export default router;
