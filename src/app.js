import express from "express";
const app = express();

// only for testing remove it if you want
app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
