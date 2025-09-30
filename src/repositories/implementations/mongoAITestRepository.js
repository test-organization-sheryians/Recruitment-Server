import IAITestRepository from "../contracts/IAITestRepository.js";
import AITest from "../../models/AITest.js";
import mongoose from "mongoose";

class MongoAITestRepository extends IAITestRepository {
  async createAITest({ userId, title, summary, totalMarks, duration }) {
    try {
      const aitest = new AITest({
        userId,
        title,
        summary,
        totalMarks,
        duration,
      });

      return await aitest.save();
    } catch (error) {
      throw new Error("Failed to create AITest");
    }
  }

  async getAITestByUserId(userId) {
    try {
      const aitests = await AITest.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: "questionanswers",
            localField: "_id",
            foreignField: "aitestId",
            as: "questions",
          },
        },

        {
          $project: {
            _id: 1,
            title: 1,
            summary: 1,
            totalMarks: 1,
            duration: 1,
            questions: 1,
          },
        },
      ]);

      if (aitests?.length === 0) {
        throw new Error("AITest not found");
      }

      return aitests[0];
    } catch (error) {
      throw new Error("Failed to get AITest");
    }
  }

  async getAITestById(id) {
    try {
      const aitest = await AITest.aggregate([
        {
          $match: { _id: new mongoose.Types.ObjectId(id) },
        },
        {
          $lookup: {
            from: "questionanswers",
            localField: "_id",
            foreignField: "aitestId",
            as: "questions",
          },
        },

        {
          $project: {
            _id: 1,
            title: 1,
            summary: 1,
            totalMarks: 1,
            duration: 1,
            questions: 1,
          },
        },
      ]);

      if (aitest?.length === 0) {
        throw new Error("AITest not found");
      }

      return aitest[0];
    } catch (error) {
      throw new Error("Failed to get AITest");
    }
  }

  async updateAITest(id, data) {
    try {
      return await AITest.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Failed to update AITest");
    }
  }

  async deleteAITest(id) {
    try {
      return await AITest.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete AITest");
    }
  }
}

export default MongoAITestRepository;
