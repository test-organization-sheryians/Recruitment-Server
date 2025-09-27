// src/middlewares/auth.middleware.js
import AuthService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";

const authService = new AuthService();

export const authenticateJWT = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new AppError("Access denied. No token provided.", 401);

    const decoded = authService.verifyToken(token);
    req.userId = decoded.userId;
    req.roleId = decoded.roleId;
    next();
  } catch (error) {
    throw new AppError("Invalid token.", 401);
  }
};

export const authorize = (resource, action) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await authService.hasPermission(req.userId, resource, action);
      if (!hasPermission) {
        throw new AppError("Access denied. Insufficient permissions.", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
