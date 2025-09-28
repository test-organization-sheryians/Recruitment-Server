// routes/user.routes.js
import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { updateUserValidator } from "../middlewares/validators/user.validator.js";

const router = express.Router();

// Authenticated user profile
router.get("/me", authenticateJWT, authorize("user", "read"), userController.getMe);

// Update own profile (partial updates)
router.patch("/me", authenticateJWT, authorize("user", "update"), updateUserValidator, userController.updateMe);

export default router;
