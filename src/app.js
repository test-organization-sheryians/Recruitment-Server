import express from "express";
import errorHandler from "./middlewares/errorHandler.middleware.js";


const app = express();



// Error Handler
app.use(errorHandler);

// only for testing remove it if you want
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
