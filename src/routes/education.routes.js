import { Router } from "express";
import educationController from "../controllers/education.controller.js";

const router = Router();

router.post("/", educationController.createEducation);
router.get("/", educationController.getAllEducations);
router.get("/:id", educationController.getEducationById);
router.put("/:id", educationController.updateEducation);
router.delete("/:id", educationController.deleteEducation);

export default router;
