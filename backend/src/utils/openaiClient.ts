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

export async function generateOptimalTimes(topic: string): Promise<string[]> {
  try {
    const prompt = `
      Suggest 3 optimal posting times (ISO 8601 format) for the topic "${topic}".
      Consider engagement trends and time zones.
      Return only the ISO date-times separated by commas.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const times = text
      .split(/,|\n/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => new Date(t).toISOString());

    return times;
  } catch (error) {
    console.error("Gemini AI error for suggested times:", error);
    // fallback dummy times
    const now = new Date();
    return [
      new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString(),
    ];
  }
}
