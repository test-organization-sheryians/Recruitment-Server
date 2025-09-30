import UserService from "../services/user.service.js";

class UserController {
  constructor() {
    this.userService = new UserService();
    this.getMe = this.getMe.bind(this);
    this.updateMe = this.updateMe.bind(this);
  }

  async getMe(req, res, next) {
    try {
      const userId = req.userId;
      const user = await this.userService.getUser(userId);

      return res.status(200).json({
        success: true,
        data: {
          id: user.id || user._id,
          email: user.email,
          role: {
            _id: user.role._id,
            name: user.role.name,
            description: user.role.description,
          },
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req, res, next) {
    try {
      const userId = req.userId;
      const updated = await this.userService.updateUser(userId, req.body);

      return res.status(200).json({
        success: true,
        data: {
          id: updated.id || updated._id,
          email: updated.email,
          role: updated.role,
          firstName: updated.firstName || updated.name?.firstName,
          lastName: updated.lastName || updated.name?.lastName,
          phoneNumber: updated.phoneNumber,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
