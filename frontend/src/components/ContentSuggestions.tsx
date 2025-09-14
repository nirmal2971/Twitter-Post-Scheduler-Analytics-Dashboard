import React, { useState } from "react";
import {
  Box,
  VStack,
  Text,
  Button,
  Input,
  HStack,
} from "@chakra-ui/react";
import { CircularProgress } from "@mui/material"; // MUI loader
import api from "../api";   // ✅ use central api with JWT

interface Suggestion {
  id: string;
  content: string;
  hashtags?: string[];
}

interface ContentSuggestionsProps {
  onSelectSuggestion: (text: string) => void;
}

const ContentSuggestions: React.FC<ContentSuggestionsProps> = ({
  onSelectSuggestion,
}) => {
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

      // Parse Gemini text response into structured suggestions
      const lines = response.data.content
        .split("\n")
        .filter((l: string) => l.trim());
      const parsed: Suggestion[] = [];
      let current: Partial<Suggestion> = {};

      lines.forEach((line: string) => {
        if (line.toLowerCase().startsWith("tweet")) {
          if (current.content) {
            parsed.push({ id: String(parsed.length), ...current } as Suggestion);
          }
          current = { content: line.replace(/Tweet\s*\d*:\s*/i, "").trim() };
        } else if (line.toLowerCase().startsWith("hashtags")) {
          current.hashtags = line
            .replace(/Hashtags:\s*/i, "")
            .split(/\s+/)
            .filter(Boolean);
        }
      });
      if (current.content) {
        parsed.push({ id: String(parsed.length), ...current } as Suggestion);
      }

      setSuggestions(parsed);
    } catch (err) {
      console.error("Failed to fetch suggestions:", err);
      alert("Could not load suggestions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box borderWidth="1px" borderRadius="md" p={4} bg="gray.50">
      <VStack align="stretch" gap={3}>
        {/* Topic Input */}
        <HStack>
          <Input
            placeholder="Enter a topic (e.g. AI, sports, startups)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Button
            size="sm"
            colorScheme="blue"
            onClick={fetchSuggestions}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Generate"}
          </Button>
        </HStack>

        {/* Suggestions */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : suggestions.length === 0 ? (
          <Text color="gray.500">No suggestions yet. Enter a topic!</Text>
        ) : (
          <VStack gap={3} align="stretch">
            {suggestions.map((s) => (
              <Box
                key={s.id}
                p={3}
                borderWidth="1px"
                borderRadius="md"
                bg="white"
                shadow="sm"
              >
                <Text mb={2}>{s.content}</Text>
                {s.hashtags && s.hashtags.length > 0 && (
                  <Text fontSize="sm" color="blue.500">
                    {s.hashtags.join(" ")}
                  </Text>
                )}
                <Button
                  size="xs"
                  mt={2}
                  colorScheme="green"
                  onClick={() =>
                    onSelectSuggestion(
                      `${s.content} ${s.hashtags?.join(" ") || ""}`.trim()
                    )
                  }
                >
                  Insert
                </Button>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ContentSuggestions;
