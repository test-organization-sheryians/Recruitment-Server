import authService from "../services/auth.service.js";
import { AppError } from "../utils/errors.js";
import logger from "../utils/logger.js";

export const authorize = (resource, action) => {
  return async (req, res, next) => {
    try {

      if (!req.userId) {
        logger.info("No userId in request");
        throw new AppError("Unauthorized - No user ID", 401);
      }

      const hasPermission = await authService.hasPermission(
        req.userId,
        resource,
        action
      );
      console.log(hasPermission)

      if (!hasPermission) {
        logger.info("Access denied. Insufficient permissions.");
        throw new AppError("Access denied. Insufficient permissions.", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};