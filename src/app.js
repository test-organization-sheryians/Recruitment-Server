import express from "express";
import cors from "cors"
import userRoutes from './routes/user.routes.js'
import authRoutes from './routes/auth.routes.js'
import roleRoutes from "./routes/role.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import jobRoleRoutes from "./routes/jobRole.routes.js";
import errorHandler from './middlewares/errorHandler.middleware.js';
import cookieParser from "cookie-parser";
import jobCategoryRoutes from "./routes/jobCategory.routes.js";
import aiRoutes from './routes/ai.routes.js'
import educationRoutes from './routes/education.routes.js'
import { corsOptions } from "./config/corsOptions.js";
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions",permissionRoutes);
app.use("/api/jobs",jobRoleRoutes);
app.use("/api/job-categories", jobCategoryRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/ai", aiRoutes)
app.use("/api/educations", educationRoutes)

app.use(errorHandler);

export default app;
