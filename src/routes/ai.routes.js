import { Router } from "express";
import { evaluateAnswers, generateQuestion } from "../controllers/ai.controller.js";
import { uploadPDF } from "../middlewares/multer.middleware.js";

const router = Router();

router.post('/questionset', uploadPDF, generateQuestion);
router.post('/evaluateset', evaluateAnswers);

export default router;