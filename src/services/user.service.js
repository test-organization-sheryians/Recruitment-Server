// services/userService.js
import MongoUserRepository from "../repositories/implementations/MongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/RedisCacheRepository.js";
import { AppError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import crypto from "crypto";

const { JWT_SECRET } = config; // ✅ destructuring from default export

class UserService {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.cacheRepository = new RedisCacheRepository();
  }

  async register(userData) {
    const cacheKey = `user:email:${userData.email}`;
    let existingUser = await this.cacheRepository.get(cacheKey);
    if (!existingUser) {
      existingUser = await this.userRepository.findUserByEmail(userData.email);
      if (existingUser)
        await this.cacheRepository.set(cacheKey, existingUser, 3600);
    }
    if (existingUser) throw new AppError("Email already exists", 409);

    const user = await this.userRepository.createUser(userData);

    await this.cacheRepository.set(
      `user:id:${user._id}`,
      {
        id: user._id,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      3600
    );
    await this.cacheRepository.set(cacheKey, user, 3600);

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  async login({ email, password }) {
    const cacheKey = `user:email:${email}`;
    let user = await this.cacheRepository.get(cacheKey);
    if (user) {
      // Redis se aaya plain object, isme comparePassword kaam karega via bcrypt
      user.comparePassword = async function (password) {
        const bcrypt = await import("bcryptjs");
        return bcrypt.compare(password, this.password);
      };
    } else {
      user = await this.userRepository.findUserByEmail(email);
      if (!user) throw new AppError("Invalid credentials", 401);

      // Cache me store
      await this.cacheRepository.set(
        cacheKey,
        {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          password: user.password,
        },
        3600
      );
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    return {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
      token,
    };
  }

  async getUser(id) {
    const cacheKey = `user:id:${id}`;
    let user = await this.cacheRepository.get(cacheKey);
    if (!user) {
      user = await this.userRepository.findUserById(id);
      if (!user) throw new AppError("User not found", 404);
      await this.cacheRepository.set(
        cacheKey,
        { id: user._id, email: user.email, role: user.role, name: user.name },
        3600
      );
    }
    return user;
  }

  async updateUser(id, userData) {
    const { error } = this.updateUserSchema.validate(userData);
    if (error) throw new AppError(error.message, 400);

    const user = await this.userRepository.updateUser(id, userData);
    if (!user) throw new AppError("User not found", 404);

    await this.cacheRepository.set(
      `user:id:${id}`,
      { id: user._id, email: user.email, role: user.role, name: user.name },
      3600
    );

    if (userData.email) {
      await this.cacheRepository.set(`user:email:${user.email}`, user, 3600);
      if (userData.email !== user.email) {
        await this.cacheRepository.del(`user:email:${userData.email}`);
      }
    }

    return {
      id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  }
  async forgotPassword(email) {
    const user = await this.userRepository.findUserByEmail(email);
    if (!user)
      throw new AppError(
        "If email is registered, a reset link will be sent",
        200
      );

    const token = crypto.randomBytes(32).toString("hex");
    // Hash the token for storage
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const cacheKey = `reset:token:${tokenHash}`;

    // Store token to Redis, expire after 15 mins
    await this.cacheRepository.set(cacheKey, user._id, 900);

    // TODO: Send email with `token` (for now, return for frontend/testing)
    // Example reset link: https://your-frontend/reset-password?token=${token}

    return {
      message: "If email is registered, a reset link will be sent.",
      token,
    }; // Remove token in production
  }
  async resetPassword(token, newPassword) {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const cacheKey = `reset:token:${tokenHash}`;
    const userId = await this.cacheRepository.get(cacheKey);

    if (!userId) throw new AppError("Reset token is invalid or expired", 400);

    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new AppError("User not found", 404);

    user.password = newPassword;
    await user.save();

    // Invalidate token
    await this.cacheRepository.del(cacheKey);

    return { message: "Password reset successful" };
  }
}

export default UserService;
