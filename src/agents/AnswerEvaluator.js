import prompt from "../lib/prompt/answerEvaulator.js";
import { llm } from "../services/ai.service.js";

export async function answerEvaluator(state) {
  const { questionsData, answers } = state;

  // Extract questions from questionsData
  const questions = questionsData?.questions || [];

  // Validate inputs
  if (!questions.length) {
    return { evaluations: [], total: 0 };
  }

  if (!answers || !Array.isArray(answers)) {
    return { evaluations: [], total: 0 };
  }

  const evaluations = [];

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswer = answers[i];

    const res = await llm.invoke(prompt);
    try {
      const evaluation = JSON.parse(res.content || res);
      evaluations.push(evaluation);
    } catch (error) {
      console.error("Failed to parse evaluation response:", error);
      evaluations.push({ score: 0, feedback: "Failed to evaluate answer" });
    }
  }

  const total = evaluations.reduce((sum, e) => sum + e.score, 0);

  return { evaluations, total };
}
