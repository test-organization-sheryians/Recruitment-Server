// services/userService.js
import Joi from "joi";
import MongoUserRepository from "../repositories/implementations/MongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/RedisCacheRepository.js";
import { AppError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";

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
      { id: user._id, email: user.email,  role: user.role, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName },
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
        phoneNumber: user.phoneNumber
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
}

export default UserService;
