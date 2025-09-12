import dotenv from "dotenv";
dotenv.config();  // <-- must be FIRST

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import tweetRoutes from "./routes/tweet.routes";
import aiRoutes from "./routes/ai.routes";
import { initializeScheduledTweets } from "./utils/scheduler"; // <-- import scheduler init

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/tweets", tweetRoutes);
app.use("/api/ai", aiRoutes);

// Routes
app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "Backend running ✅" });
});
app.use("/api/auth", authRoutes);

// DB + Server
connectDB().then(async () => {
  console.log("MongoDB connected");

  // Initialize scheduled tweets on server start
  await initializeScheduledTweets();

  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error("DB connection error:", err);
});
