import express from "express";
import skillController from "../controllers/skill.controller.js";
import { createSkillValidator, updateSkillValidator } from "../middlewares/validators/skill.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticateJWT, authorize("skills", "create"), createSkillValidator, skillController.createSkill);

router.get("/", authenticateJWT, authorize("skills", "read"), skillController.getAllSkills);

router.get("/:id", authenticateJWT, authorize("skills", "read"), skillController.getSkill);

router.put("/:id", authenticateJWT, authorize("skills", "update"), updateSkillValidator, skillController.updateSkill);

router.delete("/:id", authenticateJWT, authorize("skills", "delete"), skillController.deleteSkill);

export default router;
