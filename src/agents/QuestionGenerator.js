import { llm } from "../services/ai.service.js";

export async function questionGenerator(state) {
    const profile = state.profile

    const prompt = `
  You are an interview assistant.
  Given this profile JSON: ${JSON.stringify(profile)}

  1. Identify missing fields from the provided user profile details(summary, skills, projects, experience, socials, etc i.e., other fields that are required in the resume).
  2. If none missing, generate exactly 6 questions:
     - 2 easy, 2 medium, 2 hard
     - Each with reference answers
  Respond ONLY in JSON:
  {
    "missingFields": [...],
    "questions": [
      {"q": "...", "difficulty": "easy", "answer": "..."}
    ]
  }`;

  const res = await llm.invoke(prompt);
  console.log(res)
  console.log(typeof res)
  return { questionsData: JSON.parse(res.content)}
}

