import express from "express";
import { addTweet, listTweets, editTweet, removeTweet } from "../controllers/tweet.controller";

const router = express.Router();

router.post("/", addTweet);
router.get("/", listTweets);
router.put("/:id", editTweet);
router.delete("/:id", removeTweet);

export default router;
