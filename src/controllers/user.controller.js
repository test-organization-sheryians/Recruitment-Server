import userService from "../services/user.service.js";
import { AppError } from "../utils/errors.js";

class UserController {
  constructor() {
    if (UserController.instance) {
      return UserController.instance;
    }

    this.userService = userService;

    UserController.instance = this;
  }

  /**
   * Get current user profile (self)
   */
  getMe = async (req, res, next) => {
    try {
      const { userId } = req;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const user = await this.userService.getUser(userId);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update current user profile (self)
   */
  updateMe = async (req, res, next) => {
    try {
      const { userId } = req;
      const { email, phoneNumber, firstName, lastName } = req.body;

      if (!userId) {
        throw new AppError("Unauthorized", 401);
      }

      const user = await this.userService.updateMe(userId, {
        email,
        phoneNumber,
        firstName,
        lastName,
      });

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user by ID (admin operation)
   */
  getUser = async (req, res, next) => {
    try {
      const { id } = req.params;

      const user = await this.userService.getUser(id);

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all users (admin operation)
   */
  getAllUsers = async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, role } = req.query;

      const users = await this.userService.getAllUsers({
        page: parseInt(page),
        limit: parseInt(limit),
        search,
        role,
      });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user by ID (admin operation)
   */
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
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete user by ID (admin operation)
   */
  deleteUser = async (req, res, next) => {
    try {
      const { id } = req.params;

      await this.userService.deleteUser(id);

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}

// Export singleton instance
const userController = new UserController();
Object.freeze(userController);

export default userController;