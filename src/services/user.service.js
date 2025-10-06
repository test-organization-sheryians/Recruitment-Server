import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import authService from "./auth.service.js";
import { AppError } from "../utils/errors.js";
import MongoRoleRepository from "../repositories/implementations/mongoRoleRepository.js";
import bcrypt from "bcryptjs";


class UserService {
  constructor() {
    if (UserService.instance) {
      return UserService.instance;
    }

    this.userRepository = new MongoUserRepository();
    this.cacheRepository = new RedisCacheRepository();
    this.roleRepository = new MongoRoleRepository();

    // Cache TTL constants
    this.CACHE_TTL = {
      USER: 3600, // 1 hour
    };

    UserService.instance = this;
  }

  // ============= HELPER METHODS =============

  /**
   * Format user data for response
   */
  #formatUserResponse(user) {
    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      role: {
        _id: user.role._id,
        name: user.role.name,
      },
    };
  }

  /**
   * Cache user data with minimal payload (without password)
   */
  async #cacheUser(user) {
    const cachePayload = {
      _id: user._id,
      email: user.email,
      role: {
        _id: user.role._id,
        name: user.role.name,
      },
    };

    await Promise.all([
      this.cacheRepository.set(
        `user:id:${user._id}`,
        cachePayload,
        this.CACHE_TTL.USER
      ),
      this.cacheRepository.set(
        `user:email:${user.email}`,
        cachePayload,
        this.CACHE_TTL.USER
      ),
    ]);
  }

  /**
   * Invalidate user cache
   */
  async #invalidateUserCache(userId, email) {
    await Promise.all([
      this.cacheRepository.del(`user:id:${userId}`),
      this.cacheRepository.del(`user:email:${email}`),
    ]);
  }

  async register({ email, phoneNumber, password, firstName, lastName }) {
    const existingUser = await this.userRepository.findUserByEmail(email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    // Get default role (candidate)
    const role = await this.roleRepository.findRoleByName("candidate");
    if (!role) {
      throw new AppError("Default role not found", 500);
    }
    const hashedPassword = await this.userRepository.hashPassword(password);
    // Create user
    const user = await this.userRepository.createUser({
      email,
      phoneNumber,
      password: hashedPassword,
      firstName,
      lastName,
      roleId: role._id,
    });

    // Fetch user with populated role
    const userWithRole = await this.userRepository.findUserById(user._id);
    if (!userWithRole) {
      throw new AppError("Failed to create user", 500);
    }

    // Generate tokens using AuthService
    const accessToken = authService.generateAccessToken(
      userWithRole._id,
      userWithRole.role
    );
    const refreshToken = authService.generateRefreshToken(userWithRole._id);

    return {
      user: this.#formatUserResponse(userWithRole),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }


  async login({ email, password }) {
    // Always fetch from database for login (need password + Mongoose methods)
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Verify password using bcrypt directly (works with cached or DB users)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    // Fetch user with populated role
    const userWithRole = await this.userRepository.findUserById(user._id);
    if (!userWithRole) {
      throw new AppError("Failed to authenticate user", 500);
    }

    // Cache user data (without password)
    await this.#cacheUser(userWithRole);

    // Generate tokens using AuthService
    const accessToken = authService.generateAccessToken(
      userWithRole._id,
      userWithRole.role
    );
    const refreshToken = authService.generateRefreshToken(userWithRole._id);

    return {
      user: this.#formatUserResponse(userWithRole),
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Unauthorized", 401);
    }

    // Verify refresh token using AuthService
    const payload = authService.verifyRefreshToken(refreshToken);

    // Fetch user with role for new token
    const user = await this.userRepository.findUserById(payload.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Generate new tokens using AuthService
    const accessToken = authService.generateAccessToken(user._id, user.role);
    const newRefreshToken = authService.generateRefreshToken(user._id);

    return {
      accessToken: accessToken,
      refreshToken: newRefreshToken,
    };
  }

  async getUser(id) {
    const cacheKey = `user:id:${id}`;

    let user = await this.cacheRepository.get(cacheKey);

    if (!user) {
      user = await this.userRepository.findUserById(id);
      if (!user) {
        throw new AppError("User not found", 404);
      }
      await this.#cacheUser(user);
    }

    return this.#formatUserResponse(user);
  }

  async updateUser(id, { email, phoneNumber, firstName, lastName, roleId }) {
    const oldUser = await this.userRepository.findUserById(id);
    if (!oldUser) {
      throw new AppError("User not found", 404);
    }

    // Update user
    const user = await this.userRepository.updateUser(id, {
      email,
      phoneNumber,
      firstName,
      lastName,
      roleId,
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const userWithRole = await this.userRepository.findUserById(id);
    

    return this.#formatUserResponse(userWithRole);
  }

  async updateMe(userId, { email, phoneNumber, firstName, lastName }) {
    if (!userId) {
      throw new AppError("Unauthorized", 401);
    }

    // Get old user data for cache invalidation
    const oldUser = await this.userRepository.findUserById(userId);
    if (!oldUser) {
      throw new AppError("User not found", 404);
    }

    // Update user
    const updatedUser = await this.userRepository.updateUser(userId, {
      email,
      phoneNumber,
      firstName,
      lastName,
    });

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    // Fetch updated user with role
    const userWithRole = await this.userRepository.findUserById(userId);

    // Invalidate old cache
    await this.#invalidateUserCache(userId, oldUser.email);

    // If email changed, invalidate old email cache
    if (email && email !== oldUser.email) {
      await this.cacheRepository.del(`user:email:${oldUser.email}`);
    }

    // Cache updated user
    await this.#cacheUser(userWithRole);

    return this.#formatUserResponse(userWithRole);
  }

  async deleteUser(id) {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    await this.userRepository.deleteUser(id);
    return true;
  }


  async resetPassword(userId, oldPassword, newPassword) {
    // Fetch user with password from database
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    // Verify old password
    const isMatch = await this.userRepository.comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new AppError("Old password is incorrect", 401);
    }
   const hashedPassword = await this.userRepository.hashPassword(newPassword);  
    // Update password (pre-save hook will hash it)
    await this.userRepository.updateUser(userId, { password: hashedPassword });


    return true;
  }


  async forgotPassword(email) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      // Don't reveal if user exists
      return true;
    }

    // Generate reset token
    const resetToken = authService.generateAccessToken(user._id, user.role);

    // TODO: Send email with reset token
    // await emailService.sendPasswordResetEmail(email, resetToken);

    return true;
  }

  async resetPasswordWithToken(token, newPassword) {
    // Verify token
    const payload = authService.verifyAccessToken(token);
    if (!payload) {
      throw new AppError("Invalid or expired token", 401);
    }

    await this.userRepository.updateUser(payload.id, { password: newPassword });

    return true;
  }
}

export default new UserService();
