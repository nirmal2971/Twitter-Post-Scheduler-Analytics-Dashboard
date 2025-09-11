import { Tweet, ITweet } from "../models/tweet.model";

export const createTweet = async (tweetData: Partial<ITweet>) => {
  const tweet = await Tweet.create(tweetData);
  return tweet;
};

export const getUserTweets = async (userId: string) => {
  return Tweet.find({ userId }).sort({ scheduledAt: -1 });
};

export const updateTweet = async (tweetId: string, updateData: Partial<ITweet>) => {
  return Tweet.findByIdAndUpdate(tweetId, updateData, { new: true });
};

export const deleteTweet = async (tweetId: string) => {
  return Tweet.findByIdAndDelete(tweetId);
};
