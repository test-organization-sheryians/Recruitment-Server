import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/environment.js";
import logger from "../utils/logger.js";

const { ACCESS_SECRET, REFRESH_SECRET, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } =
  config;

class AuthService {
  constructor() {
    if (AuthService.instance) {
      return AuthService.instance;
    }
    AuthService.instance = this;
  }

  generateAccessToken(userId, role) {
    return jwt.sign(
      {
        id: userId,
        role: {
          _id: role._id,
          name: role.name,
        },
      },
      ACCESS_SECRET,
      { expiresIn: ACCESS_EXPIRES_IN || "15m" }
    );
  }

  generateRefreshToken(userId) {
    return jwt.sign({ id: userId }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES_IN || "7d",
    });
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, ACCESS_SECRET);
    } catch (error) {
      throw new Error("Invalid access token");
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, REFRESH_SECRET);
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }

  async getUserWithPermissions(userId) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

      if (!objectId) {
        throw new Error("Invalid userId provided");
      }

      const user = await User.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "roles",
            localField: "roleId",
            foreignField: "_id",
            as: "role",
          },
        },
        { $unwind: "$role" },
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
            email: 1,
            firstName: 1,
            lastName: 1,
            role: "$role.name",
            roleId: "$role._id",
            permissions: {
              $map: {
                input: "$permissions",
                as: "perm",
                in: {
                  resource: "$$perm.resource",
                  action: "$$perm.action",
                },
              },
            },
          },
        },
      ]);

      return user[0] || null;
    } catch (error) {
      throw new Error(`Error fetching user with permissions: ${error.message}`);
    }
  }

  async hasPermission(userId, resource, action) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;

      if (!objectId) {
        throw new Error("Invalid userId provided");
      }

      const result = await User.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "permissions",
            let: { roleId: "$roleId" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$roleId", "$$roleId"] },
                      { $eq: ["$resource", resource] },
                      {
                        $or: [
                          { $eq: ["$action", action] },
                          { $eq: ["$action", "manage"] },
                        ],
                      },
                    ],
                  },
                },
              },
            ],
            as: "permissions",
          },
        },
        {
          $project: {
            hasPermission: { $gt: [{ $size: "$permissions" }, 0] },
            roleId: 1,
            permissions: 1,
          },
        },
      ]);

      return result[0]?.hasPermission || false;
    } catch (error) {
      console.error("Error in hasPermission:", error);
      throw new Error(`Error checking permission: ${error.message}`);
    }
  }

  async hasAnyPermission(userId, permissions) {
    try {
      for (const { resource, action } of permissions) {
        const hasPermission = await this.hasPermission(
          userId,
          resource,
          action
        );
        if (hasPermission) return true;
      }
      return false;
    } catch (error) {
      throw new Error(`Error checking permissions: ${error.message}`);
    }
  }

  async hasAllPermissions(userId, permissions) {
    try {
      for (const { resource, action } of permissions) {
        const hasPermission = await this.hasPermission(
          userId,
          resource,
          action
        );
        if (!hasPermission) return false;
      }
      return true;
    } catch (error) {
      throw new Error(`Error checking permissions: ${error.message}`);
    }
  }
}

export default new AuthService();
