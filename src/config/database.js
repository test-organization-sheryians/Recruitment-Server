// db.js
import mongoose from "mongoose";
import config from "./environment.js";
const { MONGO_URI} = config;
import logger from "../utils/logger.js";

export async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    process.exit(1);
  }
}
