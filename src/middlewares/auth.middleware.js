// src/middlewares/auth.middleware.js
import AuthService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";
import { redisClient } from "../config/redis.js";

const authService = new AuthService();

export const authenticateJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new AppError("Access denied. No token provided.", 401);
    }

    // Check Redis blacklist
    const isBlacklisted = await redisClient.get(`bl_${token}`);
    if (isBlacklisted) {
      throw new AppError("Token has been logged out.", 401);
    }

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;

    next();
  } catch (error) {
    next(new AppError("Invalid or expired token.", 401));
  }
};
