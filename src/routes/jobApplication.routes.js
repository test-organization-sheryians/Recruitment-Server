import express from 'express';
import MongoJobApplicationRepository from '../repositories/implementations/mongoJobApplicationRepository.js';
import JobApplicationService from '../services/jobApplication.service.js';
import JobApplicationController from '../controllers/jobApplication.controller.js';
import {
    createJobApplicationSchema,
    updateJobApplicationSchema,
    updateStatusSchema,
} from '../middlewares/validators/jobApplication.validator.js';
import validateRequest from '../utils/validateFnc.js';
import { authorize } from "../middlewares/role.middleware.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

const repo = new MongoJobApplicationRepository();
const service = new JobApplicationService(repo);
const controller = new JobApplicationController(service);

router.post('/', authenticateJWT, authorize("jobs", "create"), validateRequest(createJobApplicationSchema), controller.create);
router.get('/:id', authenticateJWT, authorize("jobs", "read"), controller.findById);
router.get('/', authenticateJWT, authorize("jobs", "read"), controller.findAll);
router.put('/:id', authenticateJWT, authorize("jobs", "update"), validateRequest(updateJobApplicationSchema), controller.update);
router.delete('/:id', authenticateJWT, authorize("jobs", "delete"), controller.delete);
router.patch('/:id/status', authenticateJWT, authorize("jobs", "update"), validateRequest(updateStatusSchema), controller.updateStatus);

export default router;
