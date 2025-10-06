import JobRequirementService from "../services/jobRequirement.service.js";
import {
  createJobRequirementValidator,
  updateJobRequirementValidator,
} from "../middlewares/validators/jobRequirement.validator.js";

class JobRequirementController {
  constructor() {
    this.service = new JobRequirementService();
  }

  create = async (req, res, next) => {
    try {
        const result = await this.service.createRequirement(req.body);
        return res.status(201).json({
          success: true,
          message: "JobRequirement created",
          data: result,
        });
    } catch (err) {
      next(err);
    }
  };

  get = async (req, res, next) => {
    try {
      const result = await this.service.getRequirementById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "JobRequirement fetched",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      // Optionally allow filtering by status/companyId via query params
      const filter = {};
      if (req.query.status) filter.status = req.query.status;
      if (req.query.companyId) filter.companyId = req.query.companyId;

      const result = await this.service.listRequirements(filter);
      return res.status(200).json({
        success: true,
        message: "JobRequirements fetched",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  update = async (req, res, next) => {
    try {
        const result = await this.service.updateRequirement(
          req.params.id,
          req.body
        );
        return res.status(200).json({
          success: true,
          message: "JobRequirement updated",
          data: result,
        });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req, res, next) => {
    try {
      const result = await this.service.deleteRequirement(req.params.id);
      return res.status(200).json({
        success: true,
        message: "JobRequirement deleted",
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}

export default new JobRequirementController();
