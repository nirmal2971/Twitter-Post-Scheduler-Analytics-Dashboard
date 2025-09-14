import React, { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import api from "../api";

interface Suggestion {
  id: string;
  content: string;
  hashtags?: string[];
}

interface ContentSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({ onSelectSuggestion }) => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  const fetchSuggestions = async () => {
    if (!topic.trim()) {
      alert("Enter a topic first!");
      return;
    }
    setLoading(true);
    try {
      const response = await api.get(
        `${import.meta.env.VITE_API_BASE}/ai/suggestions?topic=${topic}`
      );

      if (!response.data.success) {
        throw new Error(response.data.error || "Unknown error");
      }

      const lines = response.data.content.split("\n").filter((l: string) => l.trim());
      const parsed: Suggestion[] = [];
      let current: Partial<Suggestion> = {};

      lines.forEach((line: string) => {
        if (line.toLowerCase().startsWith("tweet")) {
          if (current.content) parsed.push({ id: String(parsed.length), ...current } as Suggestion);
          current = { content: line.replace(/Tweet\s*\d*:\s*/i, "").trim() };
        } else if (line.toLowerCase().startsWith("hashtags")) {
          current.hashtags = line.replace(/Hashtags:\s*/i, "").split(/\s+/).filter(Boolean);
        }
      });
      if (current.content) parsed.push({ id: String(parsed.length), ...current } as Suggestion);

      setSuggestions(parsed);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      alert("Could not load suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setTopic("");
    setSuggestions([]);
  };

  const handleInsert = (text: string) => {
    onSelectSuggestion(text);
    handleReset();
  };

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 2,
        background: "rgba(17, 24, 39, 0.95)",
        boxShadow: "0 6px 20px rgba(0, 229, 255, 0.2)",
      }}
    >
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            variant="standard"
            label="Enter a topic"
            InputLabelProps={{ style: { color: "#00e5ff" } }}
            InputProps={{ style: { color: "#fff" } }}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button
            variant="outlined"
            color="primary"
            onClick={fetchSuggestions}
            disabled={loading}
            sx={{
              color: "#00e5ff",
              borderColor: "#00e5ff",
              "&:hover": { background: "rgba(0, 229, 255, 0.1)" },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: "#00e5ff" }} /> : "Generate"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleReset}
            sx={{
              color: "#ff6b6b",
              borderColor: "#ff6b6b",
              "&:hover": { background: "rgba(255, 107, 107, 0.1)" },
            }}
          >
            Reset
          </Button>
        </Stack>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress sx={{ color: "#00e5ff" }} />
          </Box>
        ) : suggestions.length === 0 ? (
          <Typography color="#ccc">No suggestions yet. Enter a topic!</Typography>
        ) : (
          <Stack spacing={2}>
            {suggestions.map((s) => (
              <Paper
                key={s.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "rgba(25, 32, 43, 0.95)",
                  boxShadow: "0 4px 15px rgba(0, 229, 255, 0.2)",
                }}
              >
                <Typography sx={{ mb: 1, color: "#fff" }}>{s.content}</Typography>
                {s.hashtags && s.hashtags.length > 0 && (
                  <Stack direction="row" spacing={1} mb={1}>
                    {s.hashtags.map((tag, idx) => (
                      <Button
                        key={idx}
                        variant="outlined"
                        size="small"
                        sx={{
                          color: "#00e5ff",
                          borderColor: "#00e5ff",
                          textTransform: "none",
                        }}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </Stack>
                )}
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() =>
                    handleInsert(`${s.content} ${s.hashtags?.map((h) => `#${h}`).join(" ") || ""}`.trim())
                  }
                  sx={{ textTransform: "none" }}
                >
                  Insert
                </Button>
              </Paper>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
};

export default ContentSuggestions;
