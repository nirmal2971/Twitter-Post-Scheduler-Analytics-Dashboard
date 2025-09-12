import { ITweet } from "../models/tweet.model";

// Dummy scoring function
export const calculatePriorityScore = (tweet: ITweet): number => {
  // Example: longer content + hashtags = higher score
  const baseScore = tweet.content.length;
  const mediaBonus = tweet.media ? tweet.media.length * 10 : 0;
  const score = baseScore + mediaBonus;
  return score;
};
