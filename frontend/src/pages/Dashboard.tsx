import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import TweetComposer from "../components/TweetComposer";
import ScheduledTweetsList from "../components/ScheduledTweetsList";
import ContentSuggestions from "../components/ContentSuggestions";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const Dashboard: React.FC = () => {
  const [content, setContent] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: 4,
        background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ color: "#00e5ff", fontWeight: "bold" }}>
          Twitter Dashboard
        </Typography>

        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            sx={{
              color: "#00e5ff",
              borderColor: "#00e5ff",
              "&:hover": { background: "rgba(0, 229, 255, 0.1)" },
            }}
            onClick={() => setShowAnalytics(true)}
          >
            Show Analytics
          </Button>

          <Button
            variant="outlined"
            sx={{
              color: "#ff6b6b",
              borderColor: "#ff6b6b",
              "&:hover": { background: "rgba(255, 107, 107, 0.1)" },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Stack spacing={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(17, 24, 39, 0.95)",
                boxShadow: "0 8px 25px rgba(0, 229, 255, 0.2)",
              }}
            >
              <TweetComposer content={content} setContent={setContent} />
            </Paper>

            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(17, 24, 39, 0.95)",
                boxShadow: "0 8px 25px rgba(0, 229, 255, 0.2)",
              }}
            >
              <ContentSuggestions onSelectSuggestion={(text) => setContent(text)} />
            </Paper>

            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(17, 24, 39, 0.95)",
                boxShadow: "0 8px 25px rgba(0, 229, 255, 0.2)",
              }}
            >
              <ScheduledTweetsList />
            </Paper>
          </Stack>
        </Grid>
      </Grid>

      <Dialog open={showAnalytics} onClose={() => setShowAnalytics(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Tweet Analytics</DialogTitle>
        <DialogContent dividers>
          <AnalyticsDashboard />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAnalytics(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
