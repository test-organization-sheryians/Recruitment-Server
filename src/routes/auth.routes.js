import express from "express";
import authController from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
  resetPasswordValidator,
} from "../middlewares/validators/auth.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes - No authentication required
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

// Token management
router.post("/refresh", authController.refreshTokenController);

// Protected routes - Authentication required
router.post("/logout", authenticateJWT, authController.logout);
router.put("/reset-password", authenticateJWT, resetPasswordValidator, authController.resetPassword);

export default router;