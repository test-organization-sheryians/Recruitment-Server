// src/repositories/contracts/IPermissionRepository.js
class IPermissionRepository {
    async createPermission(permissionData) {
      throw new Error("Method not implemented");
    }
  
    async findPermissionById(id) {
      throw new Error("Method not implemented");
    }
  
    async findPermissionsByRole(roleId) {
      throw new Error("Method not implemented");
    }
  
    async findAllPermissions() {
      throw new Error("Method not implemented");
    }
  
    async updatePermission(id, permissionData) {
      throw new Error("Method not implemented");
    }
  
    async deletePermission(id) {
      throw new Error("Method not implemented");
    }
  
    async findByResourceAndAction(resource, action) {
      throw new Error("Method not implemented");
    }
  
    async hasPermission(userId, resource, action) {
      throw new Error("Method not implemented");
    }
  }
  
  export default IPermissionRepository;
  