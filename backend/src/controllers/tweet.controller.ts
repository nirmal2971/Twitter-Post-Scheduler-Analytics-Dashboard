import { Request, Response } from "express";
import {
  createTweet,
  getTweetsByUser,
  updateTweet,
  deleteTweet,
  markTweetAsPosted,
} from "../services/tweet.service";
import { Types } from "mongoose";
import { AuthRequest } from "../middlewares/auth.middlewares"; // <- Use your typed request

// Create a new tweet
export const createNewTweet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user.id);
    const { content, scheduledAt } = req.body;

    if (!content || content.trim().length === 0)
      return res
        .status(400)
        .json({ message: "Tweet content cannot be empty." });

    if (content.length > 280)
      return res
        .status(400)
        .json({ message: "Tweet content cannot exceed 280 characters." });

    const mediaFiles =
      (req.files as Express.Multer.File[] | undefined)?.map(
        (file) => `/uploads/${file.filename}`
      ) || [];

    const tweet = await createTweet(
      userId,
      content,
      mediaFiles,
      new Date(scheduledAt)
    );

    res.status(201).json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Get all tweets for the logged-in user
export const getUserTweets = async (req: AuthRequest, res: Response) => {
  try {
    const userId = new Types.ObjectId(req.user.id); // ✅ use token id
    const tweets = await getTweetsByUser(userId);
    res.json(tweets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Update a tweet (make sure only owner can update)
export const updateExistingTweet = async (req: AuthRequest, res: Response) => {
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
export const deleteExistingTweet = async (req: AuthRequest, res: Response) => {
  try {
    const tweetId = req.params.id;
    const tweet = await deleteTweet(tweetId);
    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Mark tweet as posted
export const postTweet = async (req: AuthRequest, res: Response) => {
  try {
    const tweetId = req.params.id;
    const tweet = await markTweetAsPosted(tweetId);
    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
