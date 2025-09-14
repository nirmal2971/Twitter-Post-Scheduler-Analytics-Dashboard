import express from "express";
import {
  createNewTweet,
  getUserTweets,
  updateExistingTweet,
  deleteExistingTweet,
  postTweet,
} from "../controllers/tweet.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import { upload } from "../middlewares/upload.middleware";

const router = express.Router();

// Correct routes
router.post("/", authMiddleware, upload.array("media"), createNewTweet);
router.get("/", authMiddleware, getUserTweets);
router.put("/:id", authMiddleware, updateExistingTweet);
router.delete("/:id", authMiddleware, deleteExistingTweet);
router.post("/:id/post", authMiddleware, postTweet);

export default router;
