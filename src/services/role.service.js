// src/services/role.service.js
import MongoRoleRepository from "../repositories/implementations/mongoRoleRepository.js";
import MongoPermissionRepository from "../repositories/implementations/mongoPermissionRepository.js";
import { AppError } from "../utils/errors.js";

class RoleService {
  constructor() {
    this.roleRepository = new MongoRoleRepository();
    this.permissionRepository = new MongoPermissionRepository();
  }

  async createRole(roleData) {
    const existingRole = await this.roleRepository.findRoleByName(roleData.name);
    if (existingRole) {
      throw new AppError("Role already exists", 409);
    }

    return await this.roleRepository.createRole(roleData);
  }

  async getAllRoles() {
    return await this.roleRepository.findAllRoles();
  }

  async getRoleById(id) {
    const role = await this.roleRepository.findRoleById(id);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return role;
  }

  async updateRole(id, roleData) {
    const role = await this.roleRepository.updateRole(id, roleData);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return role;
  }

  async deleteRole(id) {
    // Check if role has associated permissions
    const permissions = await this.permissionRepository.findPermissionsByRole(id);
    if (permissions.length > 0) {
      throw new AppError("Cannot delete role with existing permissions", 400);
    }

    const role = await this.roleRepository.deleteRole(id);
    if (!role) {
      throw new AppError("Role not found", 404);
    }
    return role;
  }

  async getRoleWithPermissions(roleId) {
    const result = await this.roleRepository.getRoleWithPermissions(roleId);
    if (!result || result.length === 0) {
      throw new AppError("Role not found", 404);
    }
    return result[0];
  }
}

export default RoleService;
