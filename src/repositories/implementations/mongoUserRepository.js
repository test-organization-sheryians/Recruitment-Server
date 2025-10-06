import mongoose from "mongoose";
import IUserRepository from "../contracts/IUserRepository.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";
import bcrypt from "bcryptjs";

class MongoUserRepository extends IUserRepository {
  async createUser(userData) {
    try {
      const user = new User(userData);
      const saveUser = await user.save();
      return saveUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new AppError(`Failed to create user: ${error.message}`, 500, error);
    }
  }

  async findUserByEmail(email) {
    try {
      const [user] = await User.aggregate([
        {
          $match: { email: email },
        },
        {
          $lookup: {
            from: "roles",
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
        {
          $lookup: {
            from: "permissions",
            localField: "role._id",
            foreignField: "roleId",
            as: "permissions",
          },
        },

        {
          $project: {
            _id: 1,
            email: 1,
            firstName: 1,
            lastName: 1,
            phoneNumber: 1,
            password: 1,
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
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) {
      console.log("ERROR: Invalid ObjectId format");
      return null;
    }

    const objectId = new mongoose.Types.ObjectId(id);

    const [user] = await User.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: "roles", 
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
      {
        $lookup: {
          from: "permissions",
          localField: "role._id",
          foreignField: "roleId",
          as: "permissions",
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          password: 1,
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
      { $limit: 1 },
    ]);
    return user;
  }

  async updateUser(id, userData) {
    try {
      return await User.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
      throw new AppError("Failed to update user", 500, error);
    }
  }

  async comparePassword(password, userPassword) {
    return await bcrypt.compare(password, userPassword);
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }
}

export default MongoUserRepository;
