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
const app = express();


const AllowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];

export const corsOptions = {
  origin: function (origin, callback) {
    if (
      AllowedOrigins.indexOf(origin) !== -1 ||
      (process.env.NODE_ENV === "development" && !origin)
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE"],
};


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
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

export default app;
