class IQuestionAnswerRepository {
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
    throw new Error("Method not implemented");
  }

  async getQuestionAnswerById(id) {
    throw new Error("Method not implemented");
  }

  async updateQuestionAnswer(id, data) {
    throw new Error("Method not implemented");
  }

  async deleteQuestionAnswer(id) {
    throw new Error("Method not implemented");
  }
}
