import prompt from "../lib/prompt/questionGenerator.js";
import { llm } from "../services/ai.service.js";

export async function questionGenerator(state) {
  const profile = state.profile;

  const fullPrompt = `${JSON.stringify(prompt)}

CANDIDATE PROFILE DATA:
${JSON.stringify(profile, null, 2)}

Based on the above candidate profile, generate exactly 6 programming questions following the specified format and rules.`;

  const res = await llm.invoke(fullPrompt);
  console.log(res);
  console.log(typeof res);
  return { questionsData: JSON.parse(res.content) };
}
