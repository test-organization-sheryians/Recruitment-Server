import UserService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";

import AuthService from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  // Arrow functions automatically bind `this`
  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await this.userService.register(userData);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,      // true if using HTTPS
        sameSite: "none",  // or "lax" depending on frontend
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await this.userService.login({ email, password });
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,      // true if using HTTPS
        sameSite: "none",  // or "lax" depending on frontend
        maxAge: 60 * 60 * 1000, // 1 hour
      });
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userData = req.body;
      const user = await this.userService.updateUser(id, userData);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  };

  // Logout
  logout = async (req, res, next) => {
    try {
      const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

      if (token) {
        const decoded = this.authService.verifyToken(token);
        const exp = decoded.exp * 1000; // expiry timestamp in ms
        const ttl = Math.floor((exp - Date.now()) / 1000); // seconds left
        if (ttl > 0) {
          await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");
        }
      }

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  // Reset Password
  resetPassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await this.userService.resetPassword(userId, oldPassword, newPassword);

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      if (error.message === "Old password is incorrect") {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  };
}

export default new AuthController();
