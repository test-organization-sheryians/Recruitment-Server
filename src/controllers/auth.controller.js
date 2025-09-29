// src/controllers/auth.controller.js
import UserService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";

class AuthController {
  constructor() {
    this.userService = new UserService();
  }
  // ....................refresh token controller ........................

  refreshTokenController = async (req, res, next) => {
    try {
      // Get refresh token from cookies
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new AppError("Unauthorized", 401);

      // Call service to refresh tokens
      const tokens = await this.userService.refresh(refreshToken);

      // Set new access token cookie
      res.cookie("token", tokens.accessToken, {
        httpOnly: true,
        secure: true, // true if using HTTPS
        sameSite: "none", // adjust depending on frontend
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      // Set new refresh token cookie
      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  // ..........................register and login controller..........................................

  // Arrow functions automatically bind `this`
  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await this.userService.register(userData);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true, // true if using HTTPS
        sameSite: "none", // or "lax" depending on frontend
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
        secure: true, // true if using HTTPS
        sameSite: "none", // or "lax" depending on frontend
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
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
}

// Export a single instance
export default new AuthController();
