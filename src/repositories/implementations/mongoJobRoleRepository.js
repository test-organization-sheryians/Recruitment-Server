import IJobRoleRepository from "../contracts/IJobRoleRepository.js";
import JobRole from "../../models/jobRole.model.js";
import { AppError } from "../../utils/errors.js";
import mongoose from "mongoose";

class MongoJobRoleRepository extends IJobRoleRepository {
  async createJobRole(jobRoleData) {
    try {
      const jobRole = new JobRole(jobRoleData);
      return await jobRole.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to create job role", 500);
    }
  }

  async findJobRoleById(id) {
    try {
      const result = await JobRole.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: false }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: false }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
        }
      ]);
      
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new AppError("Failed to find job role", 500);
    }
  }

  async findAllJobRoles(filter = {}) {
    try {
      const matchStage = {};
      if (filter.clientId) {
        matchStage.clientId = new mongoose.Types.ObjectId(filter.clientId);
      }
      if (filter.category) {
        matchStage.category = new mongoose.Types.ObjectId(filter.category);
      }
      if (filter.title) {
        matchStage.title = { $regex: filter.title, $options: 'i' };
        console.log("matchTitle",matchStage);
      }
      if (filter.expiry) {
        if (filter.expiry === 'active') {
          matchStage.expiry = { $gte: new Date() };
        } else if (filter.expiry === 'expired') {
          matchStage.expiry = { $lt: new Date() };
        }
      }

      const [job]= await JobRole.aggregate([
        { $match: matchStage },
        {
          $lookup: {
            from: "users",
            localField: "createdBy",
            foreignField: "_id",
            as: "createdBy",
            pipeline: [{ $project: { name: 1, email: 1 } }]
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$createdBy", preserveNullAndEmptyArrays: false }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: false }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
        },
        { $sort: { createdAt: -1 } }
      ]);
      console.log(job);
      return job;
    } catch (error) {
      throw new AppError("Failed to fetch job roles", 500);
    }
  }

  async updateJobRole(id, jobRoleData) {
    try {
      return await JobRole.findByIdAndUpdate(id, jobRoleData, {
        new: true,
        runValidators: true
      });
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("Job role with this title already exists for this client", 409);
      }
      throw new AppError("Failed to update job role", 500);
    }
  }

  async deleteJobRole(id) {
    try {
      return await JobRole.findByIdAndDelete(id);
    } catch (error) {
      throw new AppError("Failed to delete job role", 500);
    }
  }

  async findJobRolesByClient(clientId) {
    try {
      return await JobRole.aggregate([
        { $match: { clientId: new mongoose.Types.ObjectId(clientId) } },
        {
          $lookup: {
            from: "jobcategories",
            localField: "category",
            foreignField: "_id",
            as: "category"
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$category", preserveNullAndEmptyArrays: false }
        },
        { $sort: { createdAt: -1 } }
      ]);
    } catch (error) {
      throw new AppError("Failed to fetch client job roles", 500);
    }
  }

  async findJobRolesByCategory(categoryId) {
    try {
      return await JobRole.aggregate([
        { $match: { category: new mongoose.Types.ObjectId(categoryId) } },
        {
          $lookup: {
            from: "users",
            localField: "clientId",
            foreignField: "_id",
            as: "client",
            pipeline: [{ $project: { name: 1, email: 1, company: 1 } }]
          }
        },
        {
          $lookup: {
            from: "skills",
            localField: "skills",
            foreignField: "_id",
            as: "skills"
          }
        },
        {
          $unwind: { path: "$client", preserveNullAndEmptyArrays: false }
        },
        { $sort: { createdAt: -1 } }
      ]);
    } catch (error) {
      throw new AppError("Failed to fetch category job roles", 500);
    }
  }
}

export default MongoJobRoleRepository;
