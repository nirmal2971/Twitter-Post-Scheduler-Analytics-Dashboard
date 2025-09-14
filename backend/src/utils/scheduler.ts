import cron from "node-cron";
import { markTweetAsPosted, getScheduledTweets } from "../services/tweet.service";
import { ITweet } from "../models/tweet.model";
import { Types } from "mongoose";


export const scheduleTweet = (tweetId: string, scheduledAt: Date) => {
  const now = new Date();
  const delay = scheduledAt.getTime() - now.getTime();

  if (delay <= 0) {
    console.log(`Scheduled time in the past. Posting tweet ${tweetId} immediately.`);
    markTweetAsPosted(tweetId)
      .then(() => console.log(`Tweet ${tweetId} posted immediately.`))
      .catch(err => console.error(`Error posting tweet ${tweetId}:`, err));
    return;
  }

  const taskDate = new Date(scheduledAt);
  const cronExpression = `${taskDate.getSeconds()} ${taskDate.getMinutes()} ${taskDate.getHours()} ${taskDate.getDate()} ${taskDate.getMonth() + 1} *`;

  cron.schedule(cronExpression, async () => {
    console.log(`Posting tweet ${tweetId} at ${new Date().toISOString()}`);
    try {
      await markTweetAsPosted(tweetId);
      console.log(`Tweet ${tweetId} successfully posted.`);
    } catch (err) {
      console.error(`Error posting tweet ${tweetId}:`, err);
    }
  });

  console.log(`Tweet ${tweetId} scheduled at ${scheduledAt}`);
};


export const initializeScheduledTweets = async () => {
  try {
    const scheduledTweets: ITweet[] = await getScheduledTweets();
    scheduledTweets.forEach(tweet => {
      const tweetId = (tweet._id as Types.ObjectId).toString();
      scheduleTweet(tweetId, tweet.scheduledAt);
    });
    console.log(`${scheduledTweets.length} pending tweet(s) scheduled on server start.`);
  } catch (err) {
    console.error("Error initializing scheduled tweets:", err);
  }
};
