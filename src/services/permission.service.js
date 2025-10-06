// src/services/permission.service.js
import MongoPermissionRepository from "../repositories/implementations/mongoPermissionRepository.js";
import MongoRoleRepository from "../repositories/implementations/mongoRoleRepository.js";
import { AppError } from "../utils/errors.js";

class PermissionService {
  constructor() {
    this.permissionRepository = new MongoPermissionRepository();
    this.roleRepository = new MongoRoleRepository();
  }

  async createPermission(permissionData) {
    // Validate role exists
    const role = await this.roleRepository.findRoleById(permissionData.roleId);
    if (!role) {
      throw new AppError("Role not found", 404);
    }

    return await this.permissionRepository.createPermission(permissionData);
  }

  async getAllPermissions() {
    return await this.permissionRepository.findAllPermissions();
  }

  async getPermissionById(id) {
    const permission = await this.permissionRepository.findPermissionById(id);
    if (!permission) {
      throw new AppError("Permission not found", 404);
    }
    return permission;
  }

  async getPermissionsByRole(roleId) {
    return await this.permissionRepository.findPermissionsByRole(roleId);
  }

  async updatePermission(id, permissionData) {
    if (permissionData.roleId) {
      const role = await this.roleRepository.findRoleById(permissionData.roleId);
      if (!role) {
        throw new AppError("Role not found", 404);
      }
    }

    const permission = await this.permissionRepository.updatePermission(id, permissionData);
    if (!permission) {
      throw new AppError("Permission not found", 404);
    }
    return permission;
  }

  async deletePermission(id) {
    const permission = await this.permissionRepository.deletePermission(id);
    if (!permission) {
      throw new AppError("Permission not found", 404);
    }
    return permission;
  }

  async checkUserPermission(userId, resource, action) {
    return await this.permissionRepository.hasPermission(userId, resource, action);
  }
}

export default new PermissionService();
