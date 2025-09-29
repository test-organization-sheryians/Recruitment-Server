import express from "express";
import userRoutes from './routes/user.routes.js '
import authRoutes from './routes/auth.routes.js'
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import errorHandler from './middlewares/errorHandler.middleware.js';
import cookieParser from "cookie-parser";
import aiRoutes from './routes/ai.routes.js'
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

// Mount all routes under /api
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/ai", aiRoutes);

// Error Handler (after routes)
app.use(errorHandler);

export default app;
