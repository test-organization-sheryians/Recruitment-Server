// src/services/auth.service.js
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import config from "../config/environment.js";

class AuthService {
  async getUserWithPermissions(userId) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId) 
        ? new mongoose.Types.ObjectId(userId)
        : null;
      
      if (!objectId) {
        throw new Error('Invalid userId provided');
      }
      
      const user = await User.aggregate([
        { $match: { _id: objectId } },
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
  
    } catch (error) {
      throw new Error('Error fetching user with permissions');
    }
  }

  async hasPermission(userId, resource, action) {
    try {
      const objectId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : null;
      if (!objectId) {
        throw new Error('Invalid userId provided');
      }

      // Fetch user role name for admin shortcut
      const user = await User.findById(objectId).select('roleId').lean();
      if (!user) return false;

      const role = await mongoose.model('Role').findById(user.roleId).select('name').lean();
      if (!role) return false;

      if (role.name === 'admin') {
        // Admin has full access
        return true;
      }

      // Check permissions in permissions collection for non-admins
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

    } catch (error) {
      console.error('Error in hasPermission:', error);
      throw new Error(`Error checking permission: ${error.message}`);
    }
  }

  generateToken(userId, roleId) {
    return jwt.sign({ userId, roleId }, config.JWT_SECRET, { expiresIn: "24h" });
  }

  verifyToken(token) {
    return jwt.verify(token, config.JWT_SECRET);
  }
}

export default AuthService;
