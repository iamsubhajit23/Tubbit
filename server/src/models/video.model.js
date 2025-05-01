import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    videofile: {
      type: String, // cloudinary
      required: true,
    },
    thumbnail: {
      type: String, // cloudinary
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    duration: {
      type: Number,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    ispublished: {
      type: Boolean,
      default: true,
    },
    videofilepublicid: {
      type: String,
      required: true,
    },
    thumbnailpublicid: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = model("Video", videoSchema);
