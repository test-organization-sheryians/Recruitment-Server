import RoleService from "../services/role.service.js";

class RoleController {
  constructor() {
    this.roleService = new RoleService();
  }

  createRole = async (req, res, next) => {
    try {
      const role = await this.roleService.createRole(req.body);
      res.status(201).json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  };

  getAllRoles = async (req, res, next) => {
    try {
      const roles = await this.roleService.getAllRoles();
      res.status(200).json({ success: true, data: roles });
    } catch (error) {
      next(error);
    }
  };

  getRoleById = async (req, res, next) => {
    try {
      const role = await this.roleService.getRoleById(req.params.id);
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  };

  updateRole = async (req, res, next) => {
    try {
      const role = await this.roleService.updateRole(req.params.id, req.body);
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  };

  deleteRole = async (req, res, next) => {
    try {
      await this.roleService.deleteRole(req.params.id);
      res.status(204).json({ success: true, message: "Role deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  getRoleWithPermissions = async (req, res, next) => {
    try {
      const role = await this.roleService.getRoleWithPermissions(req.params.id);
      res.status(200).json({ success: true, data: role });
    } catch (error) {
      next(error);
    }
  };
}

export default new RoleController();
