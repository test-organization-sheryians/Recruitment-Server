// src/middlewares/role.middleware.js
import AuthService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";

const authService = new AuthService();

//Permission
export const authorize = (resource, action) => {
  return async (req, res, next) => {
    try {
      const hasPermission = await authService.hasPermission(
        req.userId,
        resource,
        action
      );
      if (!hasPermission) {
        throw new AppError("Access denied. Insufficient permissions.", 403);
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};