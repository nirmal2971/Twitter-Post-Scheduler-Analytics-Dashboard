import dotenv from "dotenv";
dotenv.config();

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

// import "./auth/passport";

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// ✅ Root route for testing backend
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/ai", aiRoutes);

// Connect to DB and start server
connectDB()
  .then(async () => {
    await initializeScheduledTweets();

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });
