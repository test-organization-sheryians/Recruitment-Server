import { Router } from "express";
import { evaluateAnswers, generateQuestion } from "../controllers/ai.controller.js";

const router = Router();

router.post('/questionset', generateQuestion);
router.post('/evaluateset', evaluateAnswers);

export default router;