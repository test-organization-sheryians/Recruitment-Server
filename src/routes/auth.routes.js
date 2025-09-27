// routes/auth.routes.js
import express from "express";
import authController from "../controllers/auth.controller.js";
import { registerValidator, loginValidator } from "../middlewares/validators/auth.validator.js";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerValidator, authController.register);
router.post("/login", loginValidator, authController.login);

export default router;
