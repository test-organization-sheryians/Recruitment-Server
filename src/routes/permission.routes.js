// src/routes/permission.routes.js
import express from "express";
import permissionController from "../controllers/permission.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
const router = express.Router();

// Admin only routes
router.post(
  "/",
  authenticateJWT,
  authorize("permissions", "manage"),
  permissionController.createPermission
);
router.get(
  "/",
  authenticateJWT,
  authorize("permissions", "manage"),
  permissionController.getAllPermissions
);
router.get(
  "/:id",
  authenticateJWT,
  authorize("permissions", "manage"),
  permissionController.getPermissionById
);
router.put(
  "/:id",
  authenticateJWT,
  authorize("permissions", "manage"),
  permissionController.updatePermission
);
router.delete(
  "/:id",
  authenticateJWT,
  authorize("permissions", "manage"),
  permissionController.deletePermission
);

// Get permissions by role
router.get(
  "/role/:roleId",
  authenticateJWT,
  authorize("permissions","manage"),
  permissionController.getPermissionsByRole
);

// Check user permission
router.get(
  "/check/user",
  authenticateJWT,
  permissionController.checkPermission
);

export default router;
