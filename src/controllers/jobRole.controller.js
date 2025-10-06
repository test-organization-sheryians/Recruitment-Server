import JobRoleService from "../services/jobRole.service.js";

class JobRoleController {
  constructor() {
    this.jobRoleService = JobRoleService;
  }

  createJobRole = async (req, res, next) => {
    try {
      const jobRoleData = {
        ...req.body,
        createdBy: req.userId
      };
      
      const jobRole = await this.jobRoleService.createJobRole(jobRoleData);
      res.status(201).json({ 
        success: true, 
        message: "Job role created successfully",
        data: jobRole 
      });
    } catch (error) {
      next(error);
    }
  };

  getAllJobRoles = async (req, res, next) => {
    try {
      const jobRoles = await this.jobRoleService.getAllJobRoles(req.query);
      res.status(200).json({ 
        success: true, 
        count: jobRoles.length,
        data: jobRoles 
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRoleById = async (req, res, next) => {
    try {
      const jobRole = await this.jobRoleService.getJobRoleById(req.params.id);
      res.status(200).json({ 
        success: true, 
        data: jobRole 
      });
    } catch (error) {
      next(error);
    }
  };

  updateJobRole = async (req, res, next) => {
    try {
      const jobRole = await this.jobRoleService.updateJobRole(req.params.id, req.body);
      res.status(200).json({ 
        success: true, 
        message: "Job role updated successfully",
        data: jobRole 
      });
    } catch (error) {
      next(error);
    }
  };

  deleteJobRole = async (req, res, next) => {
    try {
      await this.jobRoleService.deleteJobRole(req.params.id);
      res.status(200).json({ 
        success: true, 
        message: "Job role deleted successfully" 
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByClient = async (req, res, next) => {
    try {
      const jobRoles = await this.jobRoleService.getJobRolesByClient(req.params.clientId);
      res.status(200).json({ 
        success: true, 
        count: jobRoles.length,
        data: jobRoles 
      });
    } catch (error) {
      next(error);
    }
  };

  getJobRolesByCategory = async (req, res, next) => {
    try {
      const jobRoles = await this.jobRoleService.getJobRolesByCategory(req.params.categoryId);
      res.status(200).json({ 
        success: true, 
        count: jobRoles.length,
        data: jobRoles 
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveJobRoles = async (req, res, next) => {
    try {
      const jobRoles = await this.jobRoleService.getActiveJobRoles();
      res.status(200).json({ 
        success: true, 
        count: jobRoles.length,
        data: jobRoles 
      });
    } catch (error) {
      next(error);
    }
  };

  getExpiredJobRoles = async (req, res, next) => {
    try {
      const jobRoles = await this.jobRoleService.getExpiredJobRoles();
      res.status(200).json({ 
        success: true, 
        count: jobRoles.length,
        data: jobRoles 
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new JobRoleController();
