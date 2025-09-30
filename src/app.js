import express from "express";
import userRoutes from './routes/user.routes.js '
import authRoutes from './routes/auth.routes.js'
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import jobRoleRoutes from "./routes/jobRole.routes.js";
import errorHandler from './middlewares/errorHandler.middleware.js';
import cookieParser from "cookie-parser";
const app = express();


const allowedOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://your-frontend.com"
  ];
  
  const corsOptions = {
    origin(origin, callback) {
      // allow REST clients or same-origin requests without Origin header
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length", "Content-Type"],
    credentials: true,
    maxAge: 600 // cache preflight for 10 minutes
  };

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));



// Mount all routes under /api
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions",permissionRoutes);
app.use("/api/jobs",jobRoleRoutes);


// Error Handler (after routes)
app.use(errorHandler);

export default app;
