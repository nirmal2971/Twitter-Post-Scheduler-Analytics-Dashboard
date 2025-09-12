// src/utils/geminiClient.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateTweetsAndHashtags(topic: string) {
  try {
    const prompt = `Generate 3 engaging tweets and relevant hashtags for the topic: "${topic}". 
    Format as:
    Tweet 1: ...
    Hashtags: #...`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}
