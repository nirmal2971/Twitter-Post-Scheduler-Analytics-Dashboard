import React, { useEffect } from "react";
import { useTweetStore, type Tweet } from "../store/tweetStore";
import { Box, Text, VStack, HStack } from "@chakra-ui/react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../api"; // ✅ use central api with JWT

const ScheduledTweetsList: React.FC = () => {
  const tweets = useTweetStore((state) => state.tweets);
  const addTweet = useTweetStore((state) => state.addTweet);
  const deleteTweet = useTweetStore((state) => state.deleteTweet);
  const token = localStorage.getItem("token"); // <-- JWT token

  // Fetch scheduled tweets from backend on mount
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await api.get(
          `${import.meta.env.VITE_API_BASE}/tweets`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      await api.delete(`/tweets/${id}`); // <-- remove VITE_API_BASE
      deleteTweet(id); // update local state
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  };

  if (tweets.length === 0) {
    return <Text>No scheduled tweets yet. Compose one!</Text>;
  }

  return (
    <VStack gap={3} align="stretch">
      {tweets.map((tweet) => (
        <Box
          key={tweet.id}
          borderWidth="1px"
          borderRadius="md"
          p={3}
          bg={tweet.status === "scheduled" ? "blue.50" : "gray.50"}
        >
          <HStack justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Text>{tweet.content}</Text>
              {tweet.scheduledAt && (
                <Text fontSize="sm" color="gray.500">
                  Scheduled at: {new Date(tweet.scheduledAt).toLocaleString()}
                </Text>
              )}
            </Box>
            <IconButton
              aria-label="Delete tweet"
              color="error"
              size="small"
              onClick={() => handleDelete(tweet.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
};

export default ScheduledTweetsList;
