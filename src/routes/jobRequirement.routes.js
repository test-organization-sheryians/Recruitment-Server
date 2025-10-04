import express from "express";
import JobRequirementController from "../controllers/jobRequirement.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { createJobRequirementValidator, updateJobRequirementValidator } from "../middlewares/validators/jobRequirement.validator.js";

const router = express.Router();

router.use(authenticateJWT);

router.post(
  "/",
  authorize("jobs", "create"),
  createJobRequirementValidator,
  JobRequirementController.create
);

router.get("/:id", JobRequirementController.get);

router.get("/", authorize("jobs", "read"), JobRequirementController.list);

router.put(
  "/:id",
  authorize("jobs", "update"),
  updateJobRequirementValidator,
  JobRequirementController.update
);

router.delete(
  "/:id",
  authorize("jobs", "delete"),
  JobRequirementController.delete
);

export default router;
