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

const allowedOrigins = [
  "https://twitter-post-scheduler-analytics-da.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200, // 👈 ensures OPTIONS responds OK
  })
);
// Middleware
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
