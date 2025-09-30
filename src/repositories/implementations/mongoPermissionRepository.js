import IPermissionRepository from "../contracts/IPermissionRepository.js";
import Permission from "../../models/permission.model.js";
import User from "../../models/user.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoPermissionRepository extends IPermissionRepository {
  async createPermission(permissionData) {
    try {
      const permission = new Permission(permissionData);
      return await permission.save();
    } catch (error) {
      throw new AppError("Failed to create permission", 500);
    }
  }

  async findPermissionById(id) {
    try {
      return await Permission.findById(id).populate('roleId', 'name description');
    } catch (error) {
      throw new AppError("Failed to find permission", 500);
    }
  }

  async findPermissionsByRole(roleId) {
    try {
      return await Permission.find({ roleId }).populate('roleId', 'name description');
    } catch (error) {
      throw new AppError("Failed to find permissions by role", 500);
    }
  }

  async findAllPermissions() {
    try {
      return await Permission.find().populate('roleId', 'name description').sort({ resource: 1, action: 1 });
    } catch (error) {
      throw new AppError("Failed to fetch permissions", 500);
    }
  }

  async updatePermission(id, permissionData) {
    try {
      return await Permission.findByIdAndUpdate(id, permissionData, { 
        new: true, 
        runValidators: true 
      }).populate('roleId', 'name description');
    } catch (error) {
      throw new AppError("Failed to update permission", 500);
    }
  }

  async deletePermission(id) {
    try {
      return await Permission.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete permission", 500);
    }
  }

  async findByResourceAndAction(resource, action) {
    try {
      return await Permission.find({ resource, action }).populate('roleId', 'name description');
    } catch (error) {
      throw new AppError("Failed to find permissions", 500);
    }
  }

  async hasPermission(userId, resource, action) {
    try {
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
    } catch (error) {
      throw new AppError("Failed to check permission", 500);
    }
  }
}

export default MongoPermissionRepository;
