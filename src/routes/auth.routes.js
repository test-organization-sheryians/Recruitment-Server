// routes/index.js
import express from "express";
import userRoutes from "./users.js";

const router = express.Router();

router.use("/users", userRoutes);

export default router;
