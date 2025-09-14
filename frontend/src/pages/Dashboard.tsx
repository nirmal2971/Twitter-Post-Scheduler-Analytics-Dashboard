import React, { useState } from "react";
import { Box, Grid, GridItem, Heading, VStack, Button } from "@chakra-ui/react";
import TweetComposer from "../components/TweetComposer";
import ScheduledTweetsList from "../components/ScheduledTweetsList";
import ContentSuggestions from "../components/ContentSuggestions";
import AnalyticsDashboard from "../components/AnalyticsDashboard";

const Dashboard: React.FC = () => {
  const [content, setContent] = useState("");
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <Box p={6}>
      <Heading size="lg" mb={6}>
        Twitter Dashboard
      </Heading>

      {/* Button to toggle Analytics */}
      <Button
        mb={4}
        colorScheme="purple"
        onClick={() => setShowAnalytics((prev) => !prev)}
      >
        {showAnalytics ? "Hide Analytics" : "Show Analytics"}
      </Button>

      {showAnalytics && <AnalyticsDashboard />}

      <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6} mt={showAnalytics ? 6 : 0}>
        {/* Left Column: Composer + Suggestions */}
        <GridItem>
          <VStack gap={6} align="stretch">
            <TweetComposer content={content} setContent={setContent} />
            <ContentSuggestions onSelectSuggestion={(text) => setContent(text)} />
          </VStack>
        </GridItem>

        {/* Right Column: Scheduled Tweets */}
        <GridItem>
          <ScheduledTweetsList />
        </GridItem>
      </Grid>
    </Box>
  );
};

export default Dashboard;
