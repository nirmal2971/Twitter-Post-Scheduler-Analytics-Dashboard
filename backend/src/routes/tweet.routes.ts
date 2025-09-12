import { Router } from "express";
import {
  createNewTweet,
  getUserTweets,
  updateExistingTweet,
  getTweetsByUserId, // <-- new import
  deleteExistingTweet,
  postTweet,
} from "../controllers/tweet.controller";

const router = Router();

// Routes
router.post("/", createNewTweet); // Create tweet
router.get("/", getUserTweets); // Get all tweets for user
router.get("/user/:userId", getTweetsByUserId); // GET /api/tweets/user/:userId
router.put("/:id", updateExistingTweet); // Update tweet
router.delete("/:id", deleteExistingTweet); // Delete tweet
router.patch("/:id/post", postTweet); // Mark tweet as posted

export default router;
