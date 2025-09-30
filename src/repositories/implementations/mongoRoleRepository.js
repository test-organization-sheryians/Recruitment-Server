import IRoleRepository from "../contracts/IRoleRepository.js";
import Role from "../../models/role.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoRoleRepository extends IRoleRepository {
  async createRole(roleData) {
    try {
      const role = new Role(roleData);
      return await role.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Role name already exists", 409);
      }
      throw new AppError("Failed to create role", 500);
    }
  }

  async findRoleById(id) {
    try {
      return await Role.findById(id);
    } catch (error) {
      throw new AppError("Failed to find role", 500);
    }
  }

  async findRoleByName(name) {
    try {
      return await Role.findOne({ name: name.toLowerCase() });
    } catch (error) {
      throw new AppError("Failed to find role", 500);
    }
  }

  async findAllRoles() {
    try {
      return await Role.find().sort({ name: 1 });
    } catch (error) {
      throw new AppError("Failed to fetch roles", 500);
    }
  }

  async updateRole(id, roleData) {
    try {
      return await Role.findByIdAndUpdate(id, roleData, { 
        new: true, 
        runValidators: true 
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Role name already exists", 409);
      }
      throw new AppError("Failed to update role", 500);
    }
  }

  async deleteRole(id) {
    try {
      return await Role.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete role", 500);
    }
  }

  async getRoleWithPermissions(roleId) {
    try {
      return await Role.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(roleId) } },
        {
          $lookup: {
            from: "permissions",
            localField: "_id",
            foreignField: "roleId",
            as: "permissions"
          }
        }
      ]);
    } catch (error) {
      throw new AppError("Failed to get role with permissions", 500);
    }
  }
}

export default MongoRoleRepository;
