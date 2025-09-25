import app from "./src/app.js";
import config from "./src/config/environment.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/database.js";

const { PORT } = config;

async function startServer() {
  try {
    // 1. Connect to MongoDB
    await connectDB();

    // 2. Connect to Redis
    await connectRedis();

    // 3. Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Server failed to start:", error);
    process.exit(1);
  }
}

startServer();
