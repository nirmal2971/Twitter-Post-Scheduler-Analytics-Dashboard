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
      Suggest 3 optimal posting times for the topic "${topic}" in the future, starting from now.
      Provide the times in HH:MM (24h) format only, considering engagement trends and time zones.
      Do not include past dates; only give times of day (e.g., 14:00, 18:30, 21:00).
      Return them separated by commas.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const now = new Date();
    const times = text
      .split(/,|\n/)
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => {
        // parse hours and minutes from AI
        const [hours, minutes] = t.split(":").map(Number);
        const dt = new Date(now); // today
        dt.setUTCHours(hours, minutes, 0, 0);

        // if time already passed today, schedule for tomorrow
        if (dt <= now) dt.setUTCDate(dt.getUTCDate() + 1);

        return dt.toISOString();
      });

    return times;
  } catch (error) {
    console.error("Gemini AI error for suggested times:", error);
    // fallback: next 3 hours
    const now = new Date();
    return [
      new Date(now.getTime() + 1 * 60 * 60 * 1000).toISOString(),
      new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
      new Date(now.getTime() + 7 * 60 * 60 * 1000).toISOString(),
    ];
  }
}
