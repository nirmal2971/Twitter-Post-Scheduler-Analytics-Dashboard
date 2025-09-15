import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4173;

// Serve static files from 'dist' (Vite build output)
app.use(express.static(path.join(__dirname, "dist")));

// SPA fallback: serve index.html for all routes (for React Router)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Frontend running on port ${PORT}`);
});
