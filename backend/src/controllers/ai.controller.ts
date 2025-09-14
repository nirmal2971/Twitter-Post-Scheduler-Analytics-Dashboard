import { Request, Response } from "express";
import {
  generateTweetsAndHashtags,
  generateOptimalTimes,
} from "../utils/openaiClient";

export async function getTweetSuggestions(req: Request, res: Response) {
  try {
    const topic = req.query.topic as string;

    if (!topic) {
      return res
        .status(400)
        .json({ success: false, error: "Topic is required" });
    }

    const content = await generateTweetsAndHashtags(topic);
    res.json({ success: true, content });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getSuggestedTime(req: Request, res: Response) {
  try {
    const topic = req.query.topic as string;

    if (!topic) {
      return res
        .status(400)
        .json({ success: false, error: "Topic is required" });
    }

    const suggestedTimes = await generateOptimalTimes(topic);

    res.json({
      success: true,
      suggestedTimes,
    });
  } catch (error: any) {
    console.error("Error fetching suggested times:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
