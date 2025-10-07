import UserService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";
import AuthService from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";

class AuthController {
  constructor() {
    this.userService = UserService;
    this.authService = AuthService;
  }

  // Cookie configuration constants
  #ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
  #REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

  #cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  #setAuthCookies(res, accessToken, refreshToken) {
    res.cookie("accessToken", accessToken, {
      ...this.#cookieOptions,
      maxAge: this.#ACCESS_TOKEN_MAX_AGE,
    });

    res.cookie("refreshToken", refreshToken, {
      ...this.#cookieOptions,
      maxAge: this.#REFRESH_TOKEN_MAX_AGE,
    });
  }

  refreshTokenController = async (req, res, next) => {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        throw new AppError("Unauthorized", 401);
      }

      const { accessToken, refreshToken: newRefreshToken } = 
        await this.userService.refresh(refreshToken);

      this.#setAuthCookies(res, accessToken, newRefreshToken);

      res.status(200).json({ success: true });
    } catch (err) {
      next(err);
    }
  };

  register = async (req, res, next) => {
    try {
      const { email, phoneNumber, password, firstName, lastName, roleId } = req.body;
      
      
      const { accessToken, refreshToken, ...userData } = 
        await this.userService.register({
          email,
          phoneNumber,
          password,
          firstName,
          lastName,
          roleId,
        });

      this.#setAuthCookies(res, accessToken, refreshToken);

      res.status(201).json({ 
        success: true, 
        data: userData 
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      
      const { accessToken, refreshToken, ...userData } = 
        await this.userService.login({ email, password });

      this.#setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({ 
        success: true, 
        data: userData 
      });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUser(id);
      
      res.status(200).json({ 
        success: true, 
        data: user 
      });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { email, phoneNumber, firstName, lastName, roleId } = req.body;
      
      const user = await this.userService.updateUser(id, {
        email,
        phoneNumber,
        firstName,
        lastName,
        roleId,
      });
      
      res.status(200).json({ 
        success: true, 
        data: user 
      });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      // Clear cookies
      res.clearCookie("accessToken", this.#cookieOptions);
      res.clearCookie("refreshToken", this.#cookieOptions);

      res.status(200).json({ 
        success: true, 
        message: "Logged out successfully" 
      });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const { userId } = req;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      await this.userService.resetPassword(userId, oldPassword, newPassword);

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      if (error.message === "Old password is incorrect") {
        return res.status(401).json({ 
          success: false, 
          message: error.message 
        });
      }
      next(error);
    }
  };
}

export default new AuthController();