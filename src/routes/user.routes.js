// routes/user.routes.js
import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateJWT} from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { updateUserValidator } from "../middlewares/validators/user.validator.js";

const router = express.Router();


//Only authentication needed for self-access
router.get("/me", authenticateJWT, userController.getMe);

//Authorization only for updating (optional)
router.patch("/me", authenticateJWT, updateUserValidator, userController.updateMe);


export default router;
