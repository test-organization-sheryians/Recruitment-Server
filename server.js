import app from "./src/app.js";
import config from "./src/config/environment.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/database.js";
import logger from "./src/utils/logger.js";

const { PORT } = config;

async function startServer() {
  try {
    await connectDB();

    await connectRedis();

    app.listen(PORT, () => {
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();
