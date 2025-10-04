import MongoUserRepository from "../repositories/implementations/mongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import { AppError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";

const { JWT_SECRET } = config;

class UserService {
  constructor() {
    this.userRepository = new MongoUserRepository();
    this.cacheRepository = new RedisCacheRepository();
  }

  async saveRefreshToken(userId, refreshToken) {
    // store refresh token in Redis with user id
    await this.cacheRepository.set(
      `refresh:${userId}`,
      refreshToken,
      7 * 24 * 3600
    );
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

    const userWithRole = await this.userRepository.findUserById(user._id)
    if(!userWithRole) {
      throw new AppError("Failed to create user", 500)
    }

    await this.cacheRepository.set(
      `user:id:${userWithRole._id}`,
      {
        _id: userWithRole._id,
        email: userWithRole.email,
        role: {
          _id: userWithRole.role._id,
          name: userWithRole.role.name,
          description: userWithRole.role.description,
        },
        phoneNumber: userWithRole.phoneNumber,
        firstName: userWithRole.firstName,
        lastName: userWithRole.lastName,
      },
      3600
    );
    await this.cacheRepository.set(cacheKey, user, 3600);

    const token = jwt.sign(
      {
        id: userWithRole._id,
        role: {
          _id: userWithRole.role._id,
          name: userWithRole.role.name,
          description: userWithRole.role.description,
        },
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // ...........................refresh token........................

    const refreshToken = jwt.sign({ id: userWithRole._id }, config.REFRESH_SECRET, {
      expiresIn: config.REFRESH_EXPIRES_IN,
    });
    await this.saveRefreshToken(userWithRole._id, refreshToken);

    return {
      user: {
        id: userWithRole._id,
        email: userWithRole.email,
        role: {
          _id: userWithRole.role._id,
          name: userWithRole.role.name,
          description: userWithRole.role.description,
        },
        firstName: userWithRole.firstName,
        lastName: userWithRole.lastName,
        phoneNumber: userWithRole.phoneNumber,
      },
      token,
      refreshToken,
    };
  }

  async login({ email, password }) {
    const cacheKey = `user:email:${email}`;
    let user = await this.cacheRepository.get(cacheKey);
    if (user) {
      user.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
      };
    } else {
      user = await this.userRepository.findUserByEmail(email);
      console.log(user);
      if (!user) throw new AppError("Invalid credentials", 401);
      await this.cacheRepository.set(cacheKey, user, 3600);
    }

    user.comparePassword = async function (password) {
      return bcrypt.compare(password, this.password);
    };

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const userWithRole = await this.userRepository.findUserById(user._id);

    if(!userWithRole) {
      throw new AppError("Failed to authenticate user", 500)
    }

    await this.cacheRepository.set(`user:id:${userWithRole._id}`, userWithRole, 3600);
    await this.cacheRepository.set(`user:email:${userWithRole.email}`, userWithRole, 3600);

    const token = jwt.sign(
      {
        id: userWithRole._id,
        role: {
          _id: userWithRole.role._id,
          name: userWithRole.role.name,
          description: userWithRole.role.description,
        },
      },
      JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = jwt.sign({ id: userWithRole._id }, config.REFRESH_SECRET, {
      expiresIn: config.REFRESH_EXPIRES_IN,
    });
    await this.saveRefreshToken(userWithRole._id, refreshToken);

    return {
      user: {
        id: userWithRole._id,
        email: userWithRole.email,
        role: {
          id: userWithRole.role._id,
          name: userWithRole.role.name,
          description: userWithRole.role.description,
        },
        firstName: userWithRole.firstName,
        lastName: userWithRole.lastName,
        phoneNumber: userWithRole.phoneNumber,
      },
      token,
      refreshToken,
    };
  }

  async refresh(refreshToken) {
    if (!refreshToken) throw new AppError("Unauthorized", 401);

    try {
      const payload = jwt.verify(refreshToken, REFRESH_SECRET);

      const stored = await this.cacheRepository.get(`refresh:${payload.id}`);
      if (!stored || stored !== refreshToken)
        throw new AppError("Unauthorized", 401);

      const token = jwt.sign(
        { id: payload.id, role: payload.role },
        JWT_SECRET,
        { expiresIn: ACCESS_EXPIRES_IN }
      );

      // generate new refresh token
      const newRefreshToken = jwt.sign({ id: payload.id }, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRES_IN,
      });

      // save new refresh token in cache
      await this.saveRefreshToken(payload.id, newRefreshToken);

      return { token, refreshToken: newRefreshToken };
    } catch (err) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  async getUser(id) {
    const cacheKey = `user:id:${id}`;
    let user = await this.cacheRepository.get(cacheKey);
    if (!user) {
      user = await this.userRepository.findUserById(id);
      if (!user) throw new AppError("User not found", 404);
      await this.cacheRepository.set(cacheKey, user, 3600);
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

  async updateMe(userId, updates) {
    if (!userId) throw new AppError("Unauthorized", 401);

    const { error, value } = updateMeSchema.validate(updates, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      throw new AppError(error.details.map((d) => d.message).join(", "), 400);
    }

    // Persist update
    const updated = await this.userRepository.updateUser(userId, value);
    if (!updated) throw new AppError("User not found", 404);

    // Prepare cache-safe payload
    const shaped = {
      id: updated._id,
      email: updated.email,
      firstName: updated.firstName,
      lastName: updated.lastName,
      phoneNumber: updated.phoneNumber,
    };

    // Refresh id cache
    await this.cacheRepository.set(`user:id:${userId}`, shaped, 3600);

    // Refresh email cache
    // First, fetch previous email from cache or DB to invalidate old key if email changed
    const previousById = await this.cacheRepository.get(`user:id:${userId}`);
    const oldEmailKey = previousById?.email
      ? `user:email:${previousById.email}`
      : null;

    // Store new email mapping with password for login path optimization if desired
    await this.cacheRepository.set(
      `user:email:${updated.email}`,
      { ...shaped, password: updated.password },
      3600
    );

    if (oldEmailKey && previousById.email !== updated.email) {
      await this.cacheRepository.del(oldEmailKey);
    }

    return shaped;
  }

  async resetPassword(userId, oldPassword, newPassword) {
    // 1. Fetch user with hashed password (project only password)
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Compare old password with stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // 3. Hash new password (use saltRounds=12 for strong security)
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Update password and save
    await this.userRepository.updateUser(userId, { password: hashed });
    await this.cacheRepository.del(`user:id:${userId}`);
    await this.cacheRepository.del(`user:email:${user.email}`);
    return true;
  }
}

export default UserService;
