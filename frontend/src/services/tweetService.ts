import api from "../api";

export interface TweetPayload {
  content: string;
  scheduledAt?: string;
  media?: string[];
}

export interface Tweet {
  id: string;
  content: string;
  scheduledAt?: string;
  status: "draft" | "scheduled" | "posted";
}

// Create a new tweet
export const createTweet = async (payload: TweetPayload): Promise<Tweet> => {
  const res = await api.post(`/tweets`, payload);
  return res.data;
};

// Fetch all tweets for a user
export const fetchTweets = async (userId: string): Promise<Tweet[]> => {
  const res = await api.get(`/tweets?userId=${userId}`);
  return res.data;
};

// Delete a tweet
export const deleteTweet = async (id: string): Promise<Tweet> => {
  const res = await api.delete(`/tweets/${id}`);
  return res.data;
};

// Update a tweet
export const updateTweet = async (
  id: string,
  payload: Partial<TweetPayload>
): Promise<Tweet> => {
  const res = await api.put(`/tweets/${id}`, payload);
  return res.data;
};
