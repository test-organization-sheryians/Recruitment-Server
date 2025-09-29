import prompt from "../lib/prompt/questionGenerator.js";
import { llm } from "../services/ai.service.js";

export async function questionGenerator(state) {
  const profile = state.profile;

  const res = await llm.invoke(prompt);
  console.log(res);
  console.log(typeof res);
  return { questionsData: JSON.parse(res.content) };
}
