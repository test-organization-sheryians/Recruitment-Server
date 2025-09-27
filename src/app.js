import express from "express";
import router from './routes/users.js '
import errorHandler from './middlewares/errorHandler.middleware.js';
import cookieParser from "cookie-parser";
import aiRoutes from './routes/ai.routes.js'
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
// Mount all routes under /api
app.use("/api/users", router);

app.use("/api/ai", aiRoutes);

// only for testing remove it if you want
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Error Handler (after routes)
app.use(errorHandler);

export default app;
