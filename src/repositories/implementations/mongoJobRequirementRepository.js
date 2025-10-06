import IJobRequirementRepository from "../contracts/IJobRequirementRepository.js";
import JobRequirement from "../../models/jobRequirement.model.js";
import { AppError } from "../../utils/errors.js";

class MongoJobRequirementRepository extends IJobRequirementRepository {
  async create(requirementData) {
    try {
      return await JobRequirement.create(requirementData);
    } catch (err) {
      throw new AppError("JobRequirement creation failed", 400);
    }
  }

  async findById(id) {
    try {
      const objectId = new mongoose.Types.ObjectId(id);

      const result = await JobRequirement.aggregate([
        { $match: { _id: objectId } },
        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        { $unwind: { path: "$clientId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyId",
          },
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills",
          },
        },
      ]);

      if (!result.length) throw new AppError("JobRequirement not found", 404);
      return result[0];
    } catch (err) {
      throw new AppError("JobRequirement fetch failed", 400);
    }
  }

  async findAll(filter = {}) {
    try {
      const result = await JobRequirement.aggregate([
        { $match: filter },

        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        { $unwind: { path: "$clientId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyId",
          },
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills",
          },
        },

        { $sort: { createdAt: -1 } },
      ]);

      return result;
    } catch (err) {
      throw new AppError("JobRequirements fetch failed", 400);
    }
  }

  async update(id, requirementData) {
    try {
      const updated = await JobRequirement.findByIdAndUpdate(
        id,
        requirementData,
        {
          new: true,
          runValidators: true,
        }
      );
      return updated;
    } catch (err) {
      throw new AppError("JobRequirement update failed", 400);
    }
  }

  async delete(id) {
    try {
      const deleted = await JobRequirement.findByIdAndDelete(id);
      return deleted;
    } catch (err) {
      throw new AppError("JobRequirement deletion failed", 400);
    }
  }

  async findByCompanyId(companyId) {
    try {
      const objectId = new mongoose.Types.ObjectId(companyId);

      const result = await JobRequirement.aggregate([
        { $match: { companyId: objectId } },

        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        { $unwind: { path: "$clientId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyId",
          },
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills",
          },
        },
      ]);

      return result;
    } catch (err) {
      throw new AppError("JobRequirements fetch failed", 400);
    }
  }

  async findByStatus(status) {
    try {
      const result = await JobRequirement.aggregate([
        { $match: { status } },

        {
          $lookup: {
            from: "clients",
            localField: "clientId",
            foreignField: "_id",
            as: "clientId",
          },
        },
        { $unwind: { path: "$clientId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "companies",
            localField: "companyId",
            foreignField: "_id",
            as: "companyId",
          },
        },
        { $unwind: { path: "$companyId", preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills",
          },
        },

        { $sort: { createdAt: -1 } },
      ]);

      return result;
    } catch (err) {
      throw new AppError("JobRequirements fetch failed", 400);
    }
  }
}

export default MongoJobRequirementRepository;
