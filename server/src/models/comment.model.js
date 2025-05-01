import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const commentModel = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

commentModel.plugin(mongoosePaginate)

export const Comment = mongoose.model("Comment", commentModel);
