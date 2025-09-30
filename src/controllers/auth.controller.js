import UserService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";
import AuthService from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
  }

  refreshTokenController = async (req, res, next) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) throw new AppError("Unauthorized", 401);

      const tokens = await this.userService.refresh(refreshToken);

      res.cookie("token", tokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  register = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await this.userService.register(userData);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

  logout = async (req, res, next) => {
    try {
      const token =
        req.cookies?.token ||
        req.header("Authorization")?.replace("Bearer ", "");

      if (token) {
        const decoded = this.authService.verifyToken(token);
        const exp = decoded.exp * 1000; 
        const ttl = Math.floor((exp - Date.now()) / 1000);
        if (ttl > 0) {
          await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");
        }
      }

      res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      res
        .status(200)
        .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const result = await this.userService.resetPassword(
        userId,
        oldPassword,
        newPassword
      );

      if (result) {
        return res.status(200).json({
          success: true,
          message: "Password updated successfully",
        });
      }
    } catch (error) {
      if (error.message === "Old password is incorrect") {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  };
}

export default new AuthController();
