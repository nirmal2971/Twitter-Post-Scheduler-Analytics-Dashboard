import React, { useEffect } from "react";
import { useTweetStore, type Tweet } from "../store/tweetStore";
import { Box, Stack, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api";

const ScheduledTweetsList: React.FC = () => {
  const tweets = useTweetStore((state) => state.tweets);
  const addTweet = useTweetStore((state) => state.addTweet);
  const deleteTweet = useTweetStore((state) => state.deleteTweet);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await api.get(`${import.meta.env.VITE_API_BASE}/tweets`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const backendTweets: Tweet[] = response.data.map((t: any) => ({
          id: t._id,
          content: t.content,
          scheduledAt: t.scheduledAt,
          status: t.status,
        }));

        backendTweets.forEach((t) => addTweet(t));
      } catch (err) {
        console.error("Failed to fetch tweets:", err);
      }
    };
    fetchTweets();
  }, [addTweet, token]);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`${import.meta.env.VITE_API_BASE}/tweets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      deleteTweet(id);
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  };

  if (tweets.length === 0) {
    return (
      <Typography color="#ccc">No scheduled tweets yet. Compose one!</Typography>
    );
  }

  return (
    <Stack spacing={2}>
      {tweets.map((tweet) => (
        <Box
          key={tweet.id}
          sx={{
            p: 2,
            borderRadius: 2,
            background: tweet.status === "scheduled"
              ? "rgba(0, 229, 255, 0.05)"
              : "rgba(55, 65, 81, 0.8)",
            boxShadow: "0 4px 12px rgba(0, 229, 255, 0.2)",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography sx={{ color: "#fff", mb: 1 }}>{tweet.content}</Typography>
              {tweet.scheduledAt && (
                <Typography fontSize="0.85rem" color="#00e5ff">
                  Scheduled at: {new Date(tweet.scheduledAt).toLocaleString()}
                </Typography>
              )}
            </Box>
            <IconButton
              aria-label="Delete tweet"
              onClick={() => handleDelete(tweet.id)}
              sx={{
                color: "#ff6b6b",
                "&:hover": { background: "rgba(255, 107, 107, 0.1)" },
              }}
              size="small"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </Stack>
  );
};

export default ScheduledTweetsList;
