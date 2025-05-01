import mongoose, { Schema } from "mongoose";

const likeModel = new Schema(
  {
    likedby: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeModel);
