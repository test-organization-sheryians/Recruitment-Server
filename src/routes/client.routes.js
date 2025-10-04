import express from "express";
import clientController from "../controllers/client.controller.js";
import { authenticateJWT} from "../middlewares/auth.middleware.js";
const router = express.Router();


router.post("/", clientController.createClient);

router.get("/", clientController.getAllClients);

router.get("/:id", clientController.getClientById);

router.put("/:id", clientController.updateClient);

router.delete("/:id", clientController.deleteClient);

export default router;
