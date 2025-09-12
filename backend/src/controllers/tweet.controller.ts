import { Request, Response } from "express";
import { createTweet, getTweetsByUser, updateTweet, deleteTweet, markTweetAsPosted } from "../services/tweet.service";
import { Types } from "mongoose";

// Create a new tweet
export const createNewTweet = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.body.userId);
    const { content, media, scheduledAt } = req.body;

    const tweet = await createTweet(userId, content, media, new Date(scheduledAt));

    res.status(201).json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get tweets by userId from route params
export const getTweetsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const tweets = await getTweetsByUser(new Types.ObjectId(userId));
    res.json(tweets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tweets for a user
export const getUserTweets = async (req: Request, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.query.userId as string);
    const tweets = await getTweetsByUser(userId);
    res.json(tweets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a tweet
export const updateExistingTweet = async (req: Request, res: Response) => {
  try {
    const tweetId = req.params.id;
    const { content, media, scheduledAt } = req.body;

    const tweet = await updateTweet(
      tweetId,
      content,
      media,
      scheduledAt ? new Date(scheduledAt) : undefined,
      "UTC"
    );

    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a tweet
export const deleteExistingTweet = async (req: Request, res: Response) => {
  try {
    const tweetId = req.params.id;
    const tweet = await deleteTweet(tweetId);
    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Mark tweet as posted
export const postTweet = async (req: Request, res: Response) => {
  try {
    const tweetId = req.params.id;
    const tweet = await markTweetAsPosted(tweetId);
    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
