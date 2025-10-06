import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

// Current user routes (self-management)
router.get("/me", authenticateJWT, userController.getMe);
router.patch("/me", authenticateJWT, userController.updateMe);

// Admin routes - User management
router.get(
  "/",
  authenticateJWT,
  authorize("users", "read"),
  userController.getAllUsers
);

router.get(
  "/:id",
  authenticateJWT,
  authorize("users", "read"),
  userController.getUser
);

router.patch(
  "/:id",
  authenticateJWT,
  authorize("users", "update"),
  userController.updateUser
);

router.delete(
  "/:id",
  authenticateJWT,
  authorize("users", "delete"),
  userController.deleteUser
);

export default router;
