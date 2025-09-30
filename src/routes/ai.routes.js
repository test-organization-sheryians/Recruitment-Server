import { Router } from "express";
import { evaluateAnswers, generateQuestion } from "../controllers/ai.controller.js";
import { uploadPDF } from "../middlewares/multer.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(authenticateJWT);

router.post('/questionset', uploadPDF, generateQuestion);
router.post('/evaluateset', evaluateAnswers);

export default router;