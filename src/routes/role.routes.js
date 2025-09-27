// src/routes/role.routes.js
import express from "express";
import roleController from "../controllers/role.controller.js";
import { authenticateJWT, authorize } from "../middlewares/auth.middleware.js";
import { roleValidator } from "../middlewares/validators/role.validator.js";

const router = express.Router();

// Admin only routes
router.post("/", authenticateJWT, authorize("admin", "create"),roleValidator,roleController.createRole);
router.get("/", authenticateJWT, roleController.getAllRoles);
router.get("/:id", authenticateJWT, roleController.getRoleById);
router.put("/:id", authenticateJWT, authorize("admin", "update"), roleController.updateRole);
router.delete("/:id", authenticateJWT, authorize("admin", "delete"), roleController.deleteRole);
router.get("/:id/permissions", authenticateJWT, roleController.getRoleWithPermissions);

export default router;
