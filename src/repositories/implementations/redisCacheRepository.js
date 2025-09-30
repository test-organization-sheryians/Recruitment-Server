import ICacheRepository from "../contracts/ICacheRepository.js";
import { redisClient } from "../../config/redis.js";
import { AppError } from "../../utils/errors.js";

class RedisCacheRepository extends ICacheRepository {
  async get(key) {
    try {
      const data = await redisClient.get(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      throw new AppError("Failed to get cache", 500, error);
    }
  }

  async set(key, value, ttl) {
    try {
      await redisClient.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      throw new AppError("Failed to set cache", 500, error);
    }
  }

  async del(key) {
    try {
      await redisClient.del(key);
    } catch (error) {
      throw new AppError("Failed to delete cache", 500, error);
    }
  }
}

export default RedisCacheRepository;
