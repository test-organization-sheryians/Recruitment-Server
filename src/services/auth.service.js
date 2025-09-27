// src/services/auth.service.js
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import Permission from "../models/permission.model.js";
import config from "../config/environment.js";

class AuthService {
  async getUserWithPermissions(userId) {
    const user = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "roles",
          localField: "roleId",
          foreignField: "_id",
          as: "role"
        }
      },
      { $unwind: "$role" },
      {
        $lookup: {
          from: "permissions",
          localField: "role._id",
          foreignField: "roleId",
          as: "permissions"
        }
      },
      {
        $project: {
          email: 1,
          firstName: 1,
          lastName: 1,
          role: "$role.name",
          permissions: {
            $map: {
              input: "$permissions",
              as: "perm",
              in: {
                resource: "$$perm.resource",
                action: "$$perm.action"
              }
            }
          }
        }
      }
    ]);

    return user[0];
  }

  async hasPermission(userId, resource, action) {
    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
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
                    { $eq: ["$action", action] }
                  ]
                }
              }
            }
          ],
          as: "permission"
        }
      },
      {
        $project: {
          hasPermission: { $gt: [{ $size: "$permission" }, 0] }
        }
      }
    ]);

    return result[0]?.hasPermission || false;
  }

  generateToken(userId, roleId) {
    return jwt.sign({ userId, roleId }, config.JWT_SECRET, { expiresIn: "24h" });
  }

  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

export default AuthService;
