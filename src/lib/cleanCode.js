export function safeParseLLMJSON(raw) {
  if (!raw || typeof raw !== "string") {
    throw new Error("No raw text to parse");
  }

  let s = raw.trim();

  s = s.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");

  const firstObj = Math.min(
    ...["{", "["].map((c) => {
      const i = s.indexOf(c);
      return i === -1 ? Infinity : i;
    })
  );
  if (firstObj !== Infinity && firstObj > 0) s = s.slice(firstObj);

  try {
    return JSON.parse(s);
  } catch (err) {
    const escaped = s.replace(/"((?:[^"\\]|\\.)*)"/gs, (fullMatch, inner) => {
      if (inner.includes("\n") || inner.includes("\r") || inner.includes("\t")) {
        const replaced = inner
          .replace(/\r/g, "\\r")
          .replace(/\n/g, "\\n")
          .replace(/\t/g, "\\t");
        return `"${replaced}"`;
      }
      return fullMatch;
    });

    const cleaned = escaped.replace(/[\u0000-\u0019]+/g, "");

    try {
      return JSON.parse(cleaned);
    } catch (err2) {
      const lastCurly = cleaned.lastIndexOf("}");
      const lastSquare = cleaned.lastIndexOf("]");
      const lastIndex = Math.max(lastCurly, lastSquare);
      if (lastIndex !== -1) {
        const truncated = cleaned.slice(0, lastIndex + 1);
        try {
          return JSON.parse(truncated);
        } catch (err3) {
          const e = new Error(
            "Unable to parse JSON from LLM response after sanitization."
          );
          e.raw = raw;
          e.cleaned = cleaned;
          e.cause = err3.message;
          throw e;
        }
      }
      const e = new Error("Unable to parse JSON from LLM response.");
      e.raw = raw;
      e.cause = err2.message;
      throw e;
    }
  }
}

export function normalizeQuestionsArray(parsed) {
  let arr = [];
  if (Array.isArray(parsed)) arr = parsed;
  else if (parsed && Array.isArray(parsed.questions)) arr = parsed.questions;
  else if (parsed && parsed.questions && typeof parsed.questions === "object") {
    arr = [parsed.questions];
  } else {
    throw new Error("Parsed JSON does not contain a questions array");
  }

  return arr.map((q, i) => {
    const id = q.id ?? i + 1;
    const topics =
      Array.isArray(q.topics) && q.topics.length
        ? q.topics
        : typeof q.topics === "string"
        ? q.topics.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

    const constraints =
      Array.isArray(q.constraints) && q.constraints.length
        ? q.constraints
        : typeof q.constraints === "string"
        ? q.constraints.split(",").map((c) => c.trim()).filter(Boolean)
        : [];

    const testCases = Array.isArray(q.testCases) ? q.testCases : [];

    const question = String(q.question ?? q.prompt ?? "");
    const explanation = String(q.explanation ?? "");
    const aiSolution = typeof q.aiSolution === "string" ? q.aiSolution : (q.solution ? String(q.solution) : "");

    return {
      id,
      question,
      topics,
      constraints,
      testCases,
      explanation,
      aiSolution,
    };
  });
}