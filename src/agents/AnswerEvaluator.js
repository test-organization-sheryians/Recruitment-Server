import prompt from "../lib/prompt/answerEvaulator.js";
import { llm } from "../services/ai.service.js";

export async function answerEvaluator(state) {
  const { questionsData, questions, answers } = state;

  const questionsList = questionsData?.questions || questionsData || questions || [];

  // Validate inputs
  if (!questionsList.length) {
    return { evaluations: [], total: 0 };
  }

  if (!answers || !Array.isArray(answers)) {
    return { evaluations: [], total: 0 };
  }

  const evaluations = [];

  for (let i = 0; i < questionsList.length; i++) {
    const question = questionsList[i];
    const userAnswer = answers[i];

    if (!userAnswer) {
      evaluations.push({ score: 0, feedback: "No answer provided" });
      continue;
    }

    const evaluationPrompt = `${JSON.stringify(prompt)}

QUESTION:
${JSON.stringify(question, null, 2)}

USER ANSWER:
${userAnswer}

Evaluate the user's answer based on the question and provide a score and feedback.`;

    try {
      const res = await llm.invoke(evaluationPrompt);
      const responseText = typeof res === "string" ? res : (res && res.content ? res.content : JSON.stringify(res));
      
      const evaluation = JSON.parse(responseText);
      evaluations.push(evaluation);
    } catch (error) {
      console.error("Failed to parse evaluation response:", error);
      evaluations.push({ score: 0, feedback: "Failed to evaluate answer" });
    }
  }

  const total = evaluations.reduce((sum, e) => sum + (e.score || 0), 0);

  return { evaluations, total };
}
