import React, { useState } from "react";
import {
  Paper,
  Stack,
  Button,
  TextField,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import type { Tweet } from "../store/tweetStore";
import { useTweetStore } from "../store/tweetStore";
import api from "../api";

type TweetComposerProps = {
  content: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
};

const TweetComposer: React.FC<TweetComposerProps> = ({
  content,
  setContent,
}) => {
  const [scheduledAt, setScheduledAt] = useState<string>("");
  const [suggestedTimes, setSuggestedTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestLoading, setSuggestLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);

  const addTweet = useTweetStore((state) => state.addTweet);

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Tweet content cannot be empty.");
      return;
    }
    if (content.length > 280) {
      alert("Tweet cannot exceed 280 characters.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("content", content.trim());
      formData.append(
        "scheduledAt",
        scheduledAt
          ? new Date(scheduledAt).toISOString()
          : new Date().toISOString()
      );

      mediaFiles.forEach((file) => formData.append("media", file));

      const response = await api.post(
        `${import.meta.env.VITE_API_BASE}/tweets`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const newTweet: Tweet = {
        id: response.data._id,
        content: response.data.content,
        scheduledAt: response.data.scheduledAt,
        status: response.data.status,
        media: response.data.media || [],
      };

      addTweet(newTweet);
      setContent("");
      setScheduledAt("");
      setMediaFiles([]);
      setSuggestedTimes([]);
    } catch (err) {
      console.error(err);
      alert("Failed to create tweet. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestTime = async () => {
    if (!content.trim()) {
      alert("Enter content first!");
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
        setScheduledAt(
          new Date(response.data.suggestedTimes[0]).toISOString().slice(0, 16)
        );
      }
    } catch (err) {
      console.error(err);
      alert("Could not fetch suggested times.");
    } finally {
      setSuggestLoading(false);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMediaFiles(Array.from(e.target.files || []));
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        background: "rgba(17, 24, 39, 0.95)",
        boxShadow: "0 6px 20px rgba(0, 229, 255, 0.2)",
        color: "#fff",
      }}
    >
      <Stack spacing={2}>
        <TextField
          multiline
          minRows={3}
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          variant="outlined"
          InputProps={{ style: { color: "#fff" } }}
          InputLabelProps={{ style: { color: "#00e5ff" } }}
        />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="center"
        >
          <TextField
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            variant="standard"
            InputProps={{ style: { color: "#fff" } }}
            sx={{ width: { xs: "100%", sm: 200 } }}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              color: "#00e5ff",
              borderColor: "#00e5ff",
              "&:hover": { background: "rgba(0,229,255,0.1)" },
            }}
          >
            {loading ? (
              <CircularProgress size={20} sx={{ color: "#00e5ff" }} />
            ) : scheduledAt ? (
              "Schedule"
            ) : (
              "Add Tweet"
            )}
          </Button>

          <Button
            variant="outlined"
            color="success"
            component="label"
            sx={{ color: "#00ff99", borderColor: "#00ff99" }}
          >
            Upload Media
            <input
              type="file"
              hidden
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
            />
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleSuggestTime}
            disabled={suggestLoading}
            sx={{ color: "#ff6b6b", borderColor: "#ff6b6b" }}
          >
            {suggestLoading ? (
              <CircularProgress size={20} sx={{ color: "#ff6b6b" }} />
            ) : (
              "Suggest Time"
            )}
          </Button>
        </Stack>

        {suggestedTimes.length > 1 && (
          <TextField
            select
            label="Pick suggested time"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            variant="standard"
            InputProps={{ style: { color: "#fff" } }}
            InputLabelProps={{ style: { color: "#00e5ff" } }}
            sx={{
              width: { xs: "100%", sm: "20%" }, 
            }}
          >
            {suggestedTimes.map((time, idx) => (
              <MenuItem
                key={idx}
                value={new Date(time).toISOString().slice(0, 16)}
              >
                {new Date(time).toLocaleString()}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Stack>
    </Paper>
  );
};

export default TweetComposer;
