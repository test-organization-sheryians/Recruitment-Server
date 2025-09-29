// src/routes/role.routes.js
import express from "express";
import roleController from "../controllers/role.controller.js";
import { authenticateJWT} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Admin only routes
router.post("/", authenticateJWT, authorize("roles", "create"), roleController.createRole);
router.get("/", authenticateJWT, authorize("roles", "read"), roleController.getAllRoles);
router.get("/:id", authenticateJWT, authorize("roles", "read"), roleController.getRoleById);
router.put("/:id", authenticateJWT, authorize("roles", "update"), roleController.updateRole);
router.delete("/:id", authenticateJWT, authorize("roles", "delete"), roleController.deleteRole);
router.get("/:id/permissions", authenticateJWT, authorize("roles", "read"), roleController.getRoleWithPermissions);

export default router;
