import dotenv from "dotenv";
dotenv.config(); // <-- must be FIRST

import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { connectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import tweetRoutes from "./routes/tweet.routes";
import aiRoutes from "./routes/ai.routes";
import { initializeScheduledTweets } from "./utils/scheduler";
import path from "path";

import "./auth/passport"; // <-- initialize passport strategies

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Session config
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes); // protect routes inside tweetRoutes
app.use("/api/ai", aiRoutes);

app.get("/api/health", (_, res) => {
  res.json({ status: "ok", message: "Backend running ✅" });
});

// DB + Server
connectDB()
  .then(async () => {
    console.log("MongoDB connected");

    // Initialize scheduled tweets on server start
    await initializeScheduledTweets();

    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
