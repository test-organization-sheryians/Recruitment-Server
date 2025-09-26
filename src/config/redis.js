import redis from "redis";
import config from "./environment.js";
import logger from "../utils/logger.js";

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, REDIS_USERNAME } = config;

const client = redis.createClient({
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST, // sirf host name
    port: REDIS_PORT,
  },
});


client.on("error", (err) => {
  logger.error("Redis connection error:", err);
});

client.on("connect", () => {
  logger.info("Redis connected successfully");
});

export async function connectRedis() {
  try {
    await client.connect();
  } catch (error) {
    logger.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
}

export const redisClient = client;
