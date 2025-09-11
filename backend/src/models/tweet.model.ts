import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITweet extends Document {
  content: string;
  scheduledAt: Date;
  status: "scheduled" | "posted" | "failed";
  media?: string;
  userId: Types.ObjectId;
  createdAt: Date;
}

const tweetSchema: Schema<ITweet> = new Schema(
  {
    content: { type: String, required: true, maxlength: 280 },
    scheduledAt: { type: Date, required: true },
    status: { type: String, enum: ["scheduled", "posted", "failed"], default: "scheduled" },
    media: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const Tweet = mongoose.model<ITweet>("Tweet", tweetSchema);
