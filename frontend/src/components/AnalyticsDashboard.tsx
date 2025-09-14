import React, { useEffect, useState } from "react";
import { Box, VStack, Text, HStack, Badge, Spinner } from "@chakra-ui/react";
import { useTweetStore } from "../store/tweetStore";
import type { Tweet } from "../store/tweetStore";
import { jwtDecode } from "jwt-decode";

interface AnalyticsTweet extends Tweet {
  likes?: number;
  retweets?: number;
  replies?: number;
}

interface DecodedToken {
  id: string; // adjust if your backend uses `_id` or `userId`
  email: string;
  exp: number;
}

const AnalyticsDashboard: React.FC = () => {
  const fetchAllTweets = useTweetStore((state) => state.fetchAllTweets);
  const [tweets, setTweets] = useState<AnalyticsTweet[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTweets = async () => {
      setLoading(true);
      try {
        // 🔑 Get token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user not logged in");
          return;
        }

        // Decode the token
        const decoded: DecodedToken = jwtDecode(token);
        console.log("Decoded ID:", decoded.id);


        // Use the user ID from the token
        await fetchAllTweets(decoded.id);

        // Get tweets from store
        const allTweets = useTweetStore.getState().tweets;

        // Add dummy engagement metrics
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

  const getBadgeColor = (priority: string) => {
    switch (priority) {
      case "Viral": return "green";
      case "Performing": return "yellow";
      case "Underperforming": return "red";
      default: return "gray";
    }
  };

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Tweet Analytics
      </Text>

      {loading ? (
        <Spinner />
      ) : tweets.length === 0 ? (
        <Text>No tweets to show</Text>
      ) : (
        <VStack align="stretch" gap={3}>
          {tweets.map((tweet) => {
            const priority = getPriority(tweet);
            return (
              <Box
                key={tweet.id}
                borderWidth="1px"
                borderRadius="md"
                p={3}
                bg="gray.50"
                shadow="sm"
              >
                <Text mb={2}>{tweet.content}</Text>
                <HStack gap={3}>
                  <Badge colorScheme={getBadgeColor(priority)}>{priority}</Badge>
                  <Text fontSize="sm" color="gray.600">
                    Likes: {tweet.likes} | Retweets: {tweet.retweets} | Replies: {tweet.replies}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default AnalyticsDashboard;
