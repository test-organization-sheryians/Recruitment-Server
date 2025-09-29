import IQuestionAnswerRepository from "../contracts/IQuestionAnswerRepository.js";
import QuestionAnswer from "../../models/QuestionAnswer.js";

class MongoQuestionAnswerRepository extends IQuestionAnswerRepository {
  async createQuestionAnswer(
    userId,
    aitestId,
    question,
    answer,
    aiFeedback,
    result,
    points,
    maxPoints
  ) {
    try {
      const questionAnswer = new QuestionAnswer({
        userId,
        aitestId,
        question,
        answer,
        aiFeedback,
        result,
        points,
        maxPoints,
      });

      return await questionAnswer.save();
    } catch (error) {
      throw new Error("Failed to create QuestionAnswer");
    }
  }

  async getQuestionAnswerById(id) {
    try {
      return await QuestionAnswer.findById(id);
    } catch (error) {
      throw new Error("Failed to get QuestionAnswer");
    }
  }

  async updateQuestionAnswer(id, data) {
    try {
      return await QuestionAnswer.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw new Error("Failed to update QuestionAnswer");
    }
  }

  async deleteQuestionAnswer(id) {
    try {
      return await QuestionAnswer.findByIdAndDelete(id);
    } catch (error) {
      throw new Error("Failed to delete QuestionAnswer");
    }
  }
}

export default MongoQuestionAnswerRepository;
