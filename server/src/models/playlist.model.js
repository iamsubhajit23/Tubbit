import mongoose, { Schema } from "mongoose";

const playlistModel = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPrivate: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Playlist = mongoose.model("Playlist", playlistModel);
