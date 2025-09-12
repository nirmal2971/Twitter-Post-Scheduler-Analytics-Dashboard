import { Tweet, ITweet } from "../models/tweet.model";
import { Types } from "mongoose";
import { calculatePriorityScore } from "../utils/priorityScore";
import { suggestAlternativeTime } from "../utils/smartScheduling";
import { scheduleTweet } from "../utils/scheduler";

export const createTweet = async (
  userId: Types.ObjectId,
  content: string,
  media: string[] = [],
  scheduledAt: Date,
  userTimezone: string = "UTC"
): Promise<ITweet> => {
  const finalScheduledAt = suggestAlternativeTime(scheduledAt, userTimezone);

  const tweet = await Tweet.create({
    userId,
    content,
    media,
    scheduledAt: finalScheduledAt,
    status: "scheduled",
    priorityScore: 0,
  });

  tweet.priorityScore = calculatePriorityScore(tweet);
  await tweet.save();

  // Schedule automatically
  const tweetId = (tweet._id as Types.ObjectId).toString();
  scheduleTweet(tweetId, finalScheduledAt);

  return tweet;
};

export const getScheduledTweets = async (): Promise<ITweet[]> => {
  const now = new Date();
  return Tweet.find({ status: "scheduled", scheduledAt: { $gte: now } }).sort({ scheduledAt: 1 });
};

export const getTweetsByUser = async (userId: Types.ObjectId): Promise<ITweet[]> => {
  return Tweet.find({ userId }).sort({ scheduledAt: -1 });
};

export const updateTweet = async (
  tweetId: string,
  content?: string,
  media?: string[],
  scheduledAt?: Date,
  userTimezone?: string
): Promise<ITweet | null> => {
  const updateData: Partial<ITweet> = {};
  if (content) updateData.content = content;
  if (media) updateData.media = media;
  if (scheduledAt && userTimezone) {
    updateData.scheduledAt = suggestAlternativeTime(scheduledAt, userTimezone);
  }

  const updatedTweet = await Tweet.findByIdAndUpdate(tweetId, updateData, { new: true });
  if (updatedTweet) {
    updatedTweet.priorityScore = calculatePriorityScore(updatedTweet);
    await updatedTweet.save();

    // Reschedule tweet
    const tweetIdStr = (updatedTweet._id as Types.ObjectId).toString();
    if (updatedTweet.scheduledAt) scheduleTweet(tweetIdStr, updatedTweet.scheduledAt);
  }

  return updatedTweet;
};

export const deleteTweet = async (tweetId: string): Promise<ITweet | null> => {
  return Tweet.findByIdAndDelete(tweetId);
};

export const markTweetAsPosted = async (tweetId: string): Promise<ITweet | null> => {
  return Tweet.findByIdAndUpdate(tweetId, { status: "posted" }, { new: true });
};
