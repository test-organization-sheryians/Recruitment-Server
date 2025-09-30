import express from "express";
import skillController from "../controllers/skill.controller.js";
import { createSkillSchema, updateSkillSchema } from "../middlewares/validators/skill.validator.js";
import validateRequest from "../middlewares/validators/validateRequest.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, authorize("skills", "create"), validateRequest(createSkillSchema), skillController.createSkill);

router.get("/", authenticateJWT, authorize("skills", "read"), skillController.getAllSkills);

router.get("/:id", authenticateJWT, authorize("skills", "read"), skillController.getSkill);

router.put("/:id", authenticateJWT, authorize("skills", "update"), validateRequest(updateSkillSchema), skillController.updateSkill);

router.delete("/:id", authenticateJWT, authorize("skills", "delete"), skillController.deleteSkill);

export default router;
