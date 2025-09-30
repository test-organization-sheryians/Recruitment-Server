// services/userService.js
import MongoUserRepository from "../repositories/implementations/MongoUserRepository.js";
import RedisCacheRepository from "../repositories/implementations/RedisCacheRepository.js";
import { AppError } from "../utils/errors.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";


const { JWT_SECRET } = config; //destructuring from default export

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
      { _id: user._id, email: user.email,  role: {
        _id: user.role._id,
        name: user.role.name,
        description: user.role.description
      }, phoneNumber: user.phoneNumber, firstName: user.firstName, lastName: user.lastName },
      3600
    );
    await this.cacheRepository.set(cacheKey, user, 3600);

    const token = jwt.sign({ id: user._id, role: {
      _id: user.role._id,
      name: user.role.name,
      description: user.role.description
    } }, JWT_SECRET, {
      expiresIn: "1h",
    });


    return {
      user: {
        id: user._id,
        email: user.email,
        role: {
          _id: user.role._id,
          name: user.role.name,
          description: user.role.description
        },
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
        return bcrypt.compare(password, this.password);
      };
    } else {
      user = await this.userRepository.findUserByEmail(email);
      console.log(user)
      if (!user) throw new AppError("Invalid credentials", 401);
      // Cache me store
      await this.cacheRepository.set(cacheKey,user,3600);
    }

    user.comparePassword = async function (password) {
      return bcrypt.compare(password, this.password);
    };

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new AppError("Invalid credentials", 401);

    const token = jwt.sign({ id: user._id, role: {
      _id: user.role._id,
      name: user.role.name,
      description: user.role.description
    }}, JWT_SECRET, {
      expiresIn: "1h",
    });


    return {
      user: {
        id: user._id,
        email: user.email,
        role: {
          id: user.role._id,
          name: user.role.name,
          description: user.role.description
        },
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber
      },
      token
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
        user,
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


  async updateMe(userId, updates) {
    if (!userId) throw new AppError("Unauthorized", 401);

    const { error, value } = updateMeSchema.validate(updates, { abortEarly: false, stripUnknown: true });
    if (error) {
      throw new AppError(error.details.map(d => d.message).join(", "), 400);
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
    const oldEmailKey = previousById?.email ? `user:email:${previousById.email}` : null;

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
}

export default UserService;