import mongoose, { plugin, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const tweetModel = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imagepublicid: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

tweetModel.plugin(mongooseAggregatePaginate);
export const Tweet = mongoose.model("Tweet", tweetModel);
