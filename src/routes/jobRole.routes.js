// src/routes/jobRole.routes.js
import express from "express";
import jobRoleController from "../controllers/jobRole.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { 
  createJobRoleValidator, 
  updateJobRoleValidator, 
  filterJobRolesValidator 
} from "../middlewares/validators/jobRole.validator.js";

const router = express.Router();

// Main CRUD routes
router.post(
  "/", 
  authenticateJWT, 
  authorize("jobs", "create"), 
  createJobRoleValidator,
  jobRoleController.createJobRole
);

router.get(
  "/", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  filterJobRolesValidator,
  jobRoleController.getAllJobRoles
);

router.get(
  "/:id", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  jobRoleController.getJobRoleById
);

router.put(
  "/:id", 
  authenticateJWT, 
  authorize("jobs", "update"), 
  updateJobRoleValidator,
  jobRoleController.updateJobRole
);

router.delete(
  "/:id", 
  authenticateJWT, 
  authorize("jobs", "delete"), 
  jobRoleController.deleteJobRole
);

// Specialized routes
router.get(
  "/client/:clientId", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  jobRoleController.getJobRolesByClient
);

router.get(
  "/category/:categoryId", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  jobRoleController.getJobRolesByCategory
);

router.get(
  "/status/active", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  jobRoleController.getActiveJobRoles
);

router.get(
  "/status/expired", 
  authenticateJWT, 
  authorize("jobs", "read"), 
  jobRoleController.getExpiredJobRoles
);

export default router;
