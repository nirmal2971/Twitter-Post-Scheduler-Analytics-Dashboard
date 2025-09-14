import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, CircularProgress } from "@mui/material";
import { useTweetStore } from "../store/tweetStore";
import type { Tweet } from "../store/tweetStore";
import { jwtDecode } from "jwt-decode";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface AnalyticsTweet extends Tweet {
  likes?: number;
  retweets?: number;
  replies?: number;
}

interface DecodedToken {
  id: string;
  email: string;
  exp: number;
}

const COLORS = ["#00e5ff", "#ffb74d", "#ff6b6b"];

const AnalyticsDashboard: React.FC = () => {
  const fetchAllTweets = useTweetStore((state) => state.fetchAllTweets);
  const [tweets, setTweets] = useState<AnalyticsTweet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTweets = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded: DecodedToken = jwtDecode(token);
        await fetchAllTweets(decoded.id);

        const allTweets = useTweetStore.getState().tweets;

        const analyticsTweets: AnalyticsTweet[] = allTweets.map((t) => ({
          ...t,
          likes: Math.floor(Math.random() * 50),
          retweets: Math.floor(Math.random() * 30),
          replies: Math.floor(Math.random() * 20),
        }));

        setTweets(analyticsTweets);
      } catch (err) {
        console.error("Failed to load tweets:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTweets();
  }, []);

  const getPriority = (tweet: AnalyticsTweet) => {
    const engagement = (tweet.likes || 0) + (tweet.retweets || 0) + (tweet.replies || 0);
    if (engagement >= 100) return "Viral";
    if (engagement >= 50) return "Performing";
    return "Underperforming";
  };

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{ color: "#00e5ff", fontWeight: "bold", mb: 3 }}
      >
        Tweet Analytics
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress sx={{ color: "#00e5ff" }} />
        </Box>
      ) : tweets.length === 0 ? (
        <Typography color="#ccc">No tweets to show</Typography>
      ) : (
        <Stack spacing={3}>
          {tweets.map((tweet) => {
            const priority = getPriority(tweet);
            const data = [
              { name: "Likes", value: tweet.likes || 0 },
              { name: "Retweets", value: tweet.retweets || 0 },
              { name: "Replies", value: tweet.replies || 0 },
            ];

            return (
              <Paper
                key={tweet.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(17, 24, 39, 0.95)",
                  boxShadow: "0 6px 20px rgba(0, 229, 255, 0.2)",
                  color: "#fff",
                }}
              >
                <Typography sx={{ mb: 2 }}>{tweet.content}</Typography>
                <Typography sx={{ mb: 1, color: "#ccc" }}>Priority: {priority}</Typography>

                <Box sx={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        label
                      >
                        {data.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
