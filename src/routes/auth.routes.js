import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator, loginValidator, resetPasswordValidator } from "../middlewares/validators/auth.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

// Protected endpoints
router.post("/logout", authController.logout);

router.put(
  "/reset-password",
  authenticateJWT,
  resetPasswordValidator,
  authController.resetPassword
);

export default router;
