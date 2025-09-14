import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Textarea,
  VStack,
  HStack,
  Select,
  Text,
} from "@chakra-ui/react";
import type { Tweet } from "../store/tweetStore";
import { useTweetStore } from "../store/tweetStore";
import api from "../api"; // ✅ use central api with JWT

type TweetComposerProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const TweetComposer: React.FC<TweetComposerProps> = ({
  content,
  setContent,
}) => {
  const [scheduledAt, setScheduledAt] = useState<string | undefined>();
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const addTweet = useTweetStore((state) => state.addTweet);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  // Submit tweet
  const handleSubmit = async () => {
    // 1️⃣ Validate content
    if (!content.trim()) {
      alert("❌ Tweet content cannot be empty.");
      return;
    }
    if (content.length > 280) {
      alert("❌ Tweet content cannot exceed 280 characters.");
      return;
    }

    setLoading(true);

    try {
      // 2️⃣ Prepare FormData for media upload
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append(
        "scheduledAt",
        scheduledAt
          ? new Date(scheduledAt).toISOString()
          : new Date().toISOString()
      );

      if (mediaFiles && mediaFiles.length > 0) {
        mediaFiles.forEach((file) => formData.append("media", file));
      }

      // 3️⃣ Send to backend
      const response = await api.post(
        `${import.meta.env.VITE_API_BASE}/tweets`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${"token"}`, // include JWT if needed
          },
        }
      );

      // 4️⃣ Map backend response to local Tweet type
      const newTweet: Tweet = {
        id: response.data._id,
        content: response.data.content,
        scheduledAt: response.data.scheduledAt,
        status: response.data.status,
        media: response.data.media || [],
      };

      // 5️⃣ Update local state
      addTweet(newTweet);

      // 6️⃣ Reset input states
      setContent("");
      setScheduledAt("");
      setMediaFiles([]);
      setSuggestedTimes([]);
    } catch (err) {
      console.error("Error creating tweet:", err);
      alert("❌ Failed to create tweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch smart suggested times
  const handleSuggestTime = async () => {
    if (!content.trim()) {
      alert("Enter some content first!");
      return;
    }
    setSuggestLoading(true);
    try {
      const response = await api.get(
        `${
          import.meta.env.VITE_API_BASE
        }/ai/suggestTime?topic=${encodeURIComponent(content)}`
      );

      if (response.data?.suggestedTimes?.length) {
        setSuggestedTimes(response.data.suggestedTimes);
        // Auto-select the first suggested time
        setScheduledAt(
          new Date(response.data.suggestedTimes[0]).toISOString().slice(0, 16)
        );
      }
    } catch (err) {
      console.error("Failed to fetch suggested times:", err);
      alert("Could not fetch suggested times. Using default.");
    } finally {
      setSuggestLoading(false);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
      <VStack gap={3} align="stretch">
        <Textarea
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          resize="none"
        />

        <HStack gap={2}>
          <Input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            placeholder="Schedule tweet"
          />
          <Button colorScheme="blue" onClick={handleSubmit} isLoading={loading}>
            {scheduledAt ? "Schedule" : "Add Tweet"}
          </Button>
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={(e) => setMediaFiles(Array.from(e.target.files || []))}
          />

          <Button
            colorScheme="teal"
            size="sm"
            onClick={handleSuggestTime}
            isLoading={suggestLoading}
          >
            Suggest Best Time
          </Button>
        </HStack>

        {/* Dropdown for all suggested times */}
        {suggestedTimes.length > 1 && (
          <VStack align="stretch" gap={2}>
            <Text fontSize="sm" color="gray.600">
              Pick a suggested posting time:
            </Text>
            <select
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              {suggestedTimes.map((time, idx) => (
                <option
                  key={idx}
                  value={new Date(time).toISOString().slice(0, 16)}
                >
                  {new Date(time).toLocaleString()}
                </option>
              ))}
            </select>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default TweetComposer;
