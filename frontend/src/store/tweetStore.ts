import { create } from "zustand";
import * as tweetService from "../services/tweetService"; 

// interface MongoTweet {
//   _id: string;
//   content: string;
//   scheduledAt?: string;
//   status: "draft" | "scheduled" | "posted";
//   engagement?: {
//     likes: number;
//     retweets: number;
//     comments: number;
//   };
// }

export interface Tweet {
  id: string; 
  content: string;
  scheduledAt?: string;
  status: "draft" | "scheduled" | "posted";
  engagement?: {
    likes: number;
    retweets: number;
    comments: number;
  };
  priority?: "viral" | "performing" | "underperforming";
  media?: string[];
}

interface TweetState {
  tweets: Tweet[];
  addTweet: (tweet: Tweet) => void;
  updateTweet: (id: string, updated: Partial<Tweet>) => void;
  deleteTweet: (id: string) => void;
  fetchAllTweets: (userId: string) => Promise<void>;
  createTweet: (payload: {
    content: string;
    scheduledAt?: string;
  }) => Promise<void>;
  removeTweet: (id: string) => Promise<void>;
  computePriority: (tweet: Tweet) => "viral" | "performing" | "underperforming";
}

export const useTweetStore = create<TweetState>((set, get) => ({
  tweets: [],

addTweet: (tweet) =>
  set((state) => ({
    tweets: state.tweets.some(t => t.id === tweet.id)
      ? state.tweets // skip duplicate
      : [
          ...state.tweets,
          { ...tweet, priority: get().computePriority(tweet) },
        ],
  })),


  updateTweet: (id, updated) =>
    set((state) => ({
      tweets: state.tweets.map((t) =>
        t.id === id
          ? {
              ...t,
              ...updated,
              priority: get().computePriority({ ...t, ...updated }),
            }
          : t
      ),
    })),

  deleteTweet: (id) =>
    set((state) => ({ tweets: state.tweets.filter((t) => t.id !== id) })),

  fetchAllTweets: async (userId) => {
    try {
      const rawTweets = await tweetService.fetchTweets(userId);

      const mappedTweets: Tweet[] = rawTweets.map((t: any) => ({
        id: t._id,
        content: t.content,
        scheduledAt: t.scheduledAt,
        status: t.status,
        engagement: t.engagement,
        priority: get().computePriority(t),
      }));

      set({ tweets: mappedTweets });
    } catch (err) {
      console.error("Failed to fetch tweets:", err);
    }
  },

  createTweet: async (payload) => {
    try {
      const newTweet = await tweetService.createTweet(payload);
      get().addTweet({ ...newTweet, id: (newTweet as any)._id });
    } catch (err) {
      console.error("Failed to create tweet:", err);
    }
  },

  removeTweet: async (id) => {
    try {
      await tweetService.deleteTweet(id);
      get().deleteTweet(id);
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  },

  computePriority: (tweet) => {
    const score =
      (tweet.engagement?.likes || 0) +
      (tweet.engagement?.retweets || 0) +
      (tweet.engagement?.comments || 0);

    if (score > 50) return "viral";
    if (score > 20) return "performing";
    return "underperforming";
  },
}));
