// routes/users.js
import express from "express";
import authController from "../controllers/auth.controller.js";
import {
  registerValidator,
  loginValidator,
} from "../middlewares/validators/auth.validator.js";
import {
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../middlewares/validators/auth.validator.js";
const router = express.Router();

// Public routes
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

router.post(
  "/forgot-password",
  forgotPasswordValidator,
  authController.forgotPassword
);
router.post(
  "/reset-password",
  resetPasswordValidator,
  authController.resetPassword
);
export default router;
