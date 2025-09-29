// repositories/MongoUserRepository.js
import IUserRepository from "../contracts/IUserRepository.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";

class MongoUserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw new AppError("Failed to create user", 500, error);
    }
  }

  async findUserByEmail(email) {
    try {
      const [user] = await User.aggregate([
        // Normalize email to match how it's stored (lowercase + trimmed by schema)
        {
          $match: { email: email },
        },
        // Join role
        {
          $lookup: {
            from: "roles", // Mongoose model Role => collection "roles"
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        // Unwind single role; if no role, stop result here (or set preserveNull...: true if you want users without roles)
        {
          $unwind: {
            path: "$role",
            preserveNullAndEmptyArrays: false,
          },
        },
        // Join permissions for that role
        {
          $lookup: {
            from: "permissions", // Mongoose model Permission => collection "permissions"
            localField: "role._id",
            foreignField: "roleId",
            as: "permissions",
          },
        },
        // Keep only the fields you need
        {
          $project: {
            email: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            googleId: 1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
            permissions: {
              $map: {
                input: "$permissions",
                as: "p",
                in: {
                  _id: "$$p._id",
                  resource: "$$p.resource",
                  action: "$$p.action",
                },
              },
            },
          },
        },
        // Limit to one result
        { $limit: 1 },
      ]);

      return user || null;
    } catch (error) {
      throw new AppError(
        "Failed to find user with role and permissions",
        500,
        error
      );
    }
  }

  async findUserById(id) {
    try {
      const [user] = await User.aggregate([
        // Normalize email to match how it's stored (lowercase + trimmed by schema)
        {
          $match: { _id: id },
        },
        // Join role
        {
          $lookup: {
            from: "roles", // Mongoose model Role => collection "roles"
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },

        {
          $unwind: {
            path: "$role",
            preserveNullAndEmptyArrays: false,
          },
        },
        // Join permissions for that role
        {
          $lookup: {
            from: "permissions", // Mongoose model Permission => collection "permissions"
            localField: "role._id",
            foreignField: "roleId",
            as: "permissions",
          },
        },
        {
          $project: {
            email: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            googleId: 1,
            role: {
              _id: "$role._id",
              name: "$role.name",
              description: "$role.description",
            },
            permissions: {
              $map: {
                input: "$permissions",
                as: "p",
                in: {
                  _id: "$$p._id",
                  resource: "$$p.resource",
                  action: "$$p.action",
                },
              },
            },
          },
        },
        // Limit to one result
        { $limit: 1 },
      ]);

      return user || null;
    } catch (error) {
      throw new AppError("Failed to find user by ID", 500, error);
    }
  }

  async updateUser(id, userData) {
    try {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      throw new AppError("Failed to update user", 500, error);
    }
  }
}

export default MongoUserRepository;
