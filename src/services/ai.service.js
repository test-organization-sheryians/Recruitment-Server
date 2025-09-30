import { ChatGroq } from "@langchain/groq";
import dotenv from 'dotenv';

dotenv.config();

export const llm = new ChatGroq({
    temperature: 0,
    model: 'llama-3.1-8b-instant',
    apiKey: process.env.GROQ_API_KEY,
});