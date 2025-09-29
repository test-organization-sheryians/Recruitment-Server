import { graph } from "../utils/langgraph.js"

export async function generateQuestion(req, res) {
    try {
        const result = await graph.invoke({
            profile: req.body,
        }, { startNode: "QuestionGenerator" })

        res.json(result.questionsData)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Error generating questions" })
    }
}

export async function evaluateAnswers(req, res) {
    try {
        const { questions, answers } = req.body;
        const result = await graph.invoke({
            questions,
            answers
        }, { startNode: "AnswerEvaluator"})

        res.json({
            evaluation: result.evaluationData,
            total: result.totla
        })
    } catch (err) {
        res.status(500).json({ error: "Error evaluating answers" })
    }
}