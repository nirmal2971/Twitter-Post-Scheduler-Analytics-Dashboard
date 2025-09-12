// src/controllers/ai.controller.ts
import { Request, Response } from "express";
import { generateTweetsAndHashtags } from "../utils/openaiClient";

export async function getTweetSuggestions(req: Request, res: Response) {
  try {
    const topic = req.query.topic as string;

    if (!topic) {
      return res.status(400).json({ success: false, error: "Topic is required" });
    }

    const content = await generateTweetsAndHashtags(topic);
    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}
