import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITweet extends Document {
  userId: Types.ObjectId;
  content: string;
  media?: string[];
  scheduledAt: Date;
  status: "scheduled" | "posted" | "failed";
  priorityScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const tweetSchema: Schema<ITweet> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "posted", "failed"], default: "scheduled" },
    priorityScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);
