import AuthService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";
import { redisClient } from "../config/redis.js";


const authService = AuthService;

export const authenticateJWT = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!accessToken) {
      throw new AppError("Access denied. No accessToken provided.", 401);
    }
    
    const isBlacklisted = await redisClient.get(`bl_${accessToken}`);
    if (isBlacklisted) {
      throw new AppError("accessToken has been logged out.", 401);
    }

    const decoded = authService.verifyAccessToken(accessToken);
    req.userId = decoded.id;
    req.roleId = decoded.role._id;
    next();
  } catch (error) {
    next(new AppError("Invalid or expired accessToken.", 401));
  }
};
