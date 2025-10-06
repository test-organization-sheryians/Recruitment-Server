import PermissionService from "../services/permission.service.js";

class PermissionController {
  constructor() {
    this.permissionService = PermissionService;
  }

  createPermission = async (req, res, next) => {
    try {
      const permission = await this.permissionService.createPermission(req.body);
      res.status(201).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  };

  getAllPermissions = async (req, res, next) => {
    try {
      const permissions = await this.permissionService.getAllPermissions();
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      next(error);
    }
  };

  getPermissionById = async (req, res, next) => {
    try {
      const permission = await this.permissionService.getPermissionById(req.params.id);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  };

  getPermissionsByRole = async (req, res, next) => {
    try {
      const permissions = await this.permissionService.getPermissionsByRole(req.params.roleId);
      res.status(200).json({ success: true, data: permissions });
    } catch (error) {
      next(error);
    }
  };

  updatePermission = async (req, res, next) => {
    try {
      const permission = await this.permissionService.updatePermission(req.params.id, req.body);
      res.status(200).json({ success: true, data: permission });
    } catch (error) {
      next(error);
    }
  };

  deletePermission = async (req, res, next) => {
    try {
      await this.permissionService.deletePermission(req.params.id);
      res.status(204).json({ success: true, message: "Permission deleted successfully" });
    } catch (error) {
      next(error);
    }
  };

  checkPermission = async (req, res, next) => {
    try {
      const { resource, action } = req.query;
      const hasPermission = await this.permissionService.checkUserPermission(req.userId, resource, action);
      res.status(200).json({ success: true, data: { hasPermission } });
    } catch (error) {
      next(error);
    }
  };
}

export default new PermissionController();
