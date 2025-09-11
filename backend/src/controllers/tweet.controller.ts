import { Request, Response } from "express";
import { createTweet, getUserTweets, updateTweet, deleteTweet } from "../services/tweet.service";

export const addTweet = async (req: Request, res: Response) => {
  try {
    const tweet = await createTweet({ ...req.body, userId: req.body.userId });
    res.status(201).json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const listTweets = async (req: Request, res: Response) => {
  try {
    const tweets = await getUserTweets(req.body.userId);
    res.json(tweets);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const editTweet = async (req: Request, res: Response) => {
  try {
    const tweet = await updateTweet(req.params.id, req.body);
    res.json(tweet);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const removeTweet = async (req: Request, res: Response) => {
  try {
    await deleteTweet(req.params.id);
    res.json({ message: "Tweet deleted" });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
