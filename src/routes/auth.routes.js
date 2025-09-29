// routes/auth.routes.js
import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validators/auth.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

// Protected
router.post("/logout", authenticateJWT, authController.logout);
export default router;
