import { StateGraph } from '@langchain/langgraph';
import { questionGenerator } from '../agents/QuestionGenerator.js';
import { answerEvaluator } from '../agents/AnswerEvaluator.js';

const workflow = new StateGraph({
    channels: {
        profile: null,
        questionsData: null,
        answers: null,
        evaluations: null,
        total: null
    }
})

workflow.addNode("QuestionGenerator", questionGenerator);
workflow.addNode("AnswerEvaluator", answerEvaluator);

workflow.setEntryPoint("QuestionGenerator");

workflow.addEdge("QuestionGenerator", "AnswerEvaluator");

workflow.setFinishPoint("AnswerEvaluator");

export const graph = workflow.compile();