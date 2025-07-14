import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import sanitizeHtml from "sanitize-html";
import { deleteLocalFile } from "../utils/deleteLocalFile.js";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const imageLocalPath = req.files?.image?.[0].path;
  const userId = req.user._id;

  if (
    typeof content !== "string" ||
    content.trim().length === 0 ||
    content.length > 280
  ) {
    deleteLocalFile(imageLocalPath);
    throw new apiError(
      400,
      "Content must be a non-empty string with a maximum of 280 characters"
    );
  }

  const sanitizedContent = sanitizeHtml(content, {
    allowedTags: ["b", "i", "em", "strong", "u"],
    allowedAttributes: [],
  });

  const imageFile = await uploadOnCloudinary(imageLocalPath);

  if (!imageFile.url) {
    deleteLocalFile(imageFile);
    throw new apiError(400, "Error while uploading image on cloudinary!");
  }

  const createdTweet = await Tweet.create({
    content: sanitizedContent,
    image: imageFile.url,
    imagepublicid: imageFile.public_id,
    owner: userId,
  });

  if (!createdTweet) {
    throw new apiError(500, "Error while creating tweet");
  }

  return res
    .status(201)
    .json(new apiResponse(201, { createdTweet }, "Tweet created Successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }
  if (
    typeof content !== "string" ||
    content.trim().length === 0 ||
    content.length > 280
  ) {
    throw new apiError(
      400,
      "Content must be a non-empty string with a maximum of 280 characters"
    );
  }

  const existingTweet = await Tweet.findById(tweetId);

  if (!existingTweet) {
    throw new apiError(404, "Not found any tweet with this tweet id");
  }
  if (existingTweet.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to update this tweet");
  }

  const sanitizedContent = sanitizeHtml(content, {
    allowedAttributes: [],
    allowedTags: ["b", "i", "em", "strong", "u"],
  });

  const updatedTweet = await Tweet.findByIdAndUpdate(
    tweetId,
    {
      $set: {
        content: sanitizedContent,
      },
    },
    { new: true }
  );

  if (!updatedTweet) {
    throw new apiError(500, "Error while updating tweet");
  }

  return res
    .status(200)
    .json(new apiResponse(200, { updatedTweet }, "Tweet Updated Successfully"));
});

const getTweetById = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const existingTweet = await Tweet.findById(tweetId).populate("owner", "username fullname avatar");

  if (!existingTweet) {
    throw new apiError(404, "Not found any tweet with this tweet id");
  }
  if (
    !existingTweet.isPublic &&
    existingTweet.owner.toString() !== userId.toString()
  ) {
    throw new apiError(403, "You are not authorized to access this tweet");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { tweet: existingTweet },
        "Tweet Fetched Successfully"
      )
    );
});

const getAllTweets = asyncHandler(async (req, res) => {
  const allowedSortFields = ["views", "createdAt", "likes"];
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "views",
    sortType = "desc",
    userId,
  } = req.query;

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json(new apiResponse(400, null, "Invalid userId"));
  }

  if (!allowedSortFields.includes(sortBy)) {
    return res
      .status(400)
      .json(new apiResponse(400, null, "Invalid sortBy field"));
  }

  const sortOptions = {};
  sortOptions[sortBy] = sortType === "desc" ? -1 : 1;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOptions,
  };

  const match = {
    ...(query && {
      content: { $regex: query, $options: "i" },
    }),
    ...(userId && { owner: new mongoose.Types.ObjectId(userId) }),
  };

  const aggregate = Tweet.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    {
      $unwind: {
        path: "$owner",
        preserveNullAndEmptyArrays: true, 
      },
    },
  ]);

  const { totalDocs, totalPages, docs } = await Tweet.aggregatePaginate(
    aggregate,
    options
  );

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { docs, totalDocs, totalPages },
        "Tweets fetched successfully"
      )
    );
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const existingTweet = await Tweet.findById(tweetId);

  if (!existingTweet) {
    throw new apiError(404, "Not found any tweet with this tweet id");
  }
  if (existingTweet.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to delete this tweet");
  }

  await deleteFromCloudinary(existingTweet.imagepublicid, "image");

  const deletedTweet = await Tweet.findByIdAndDelete(existingTweet._id);
  if (!deletedTweet) {
    throw new apiError(500, "Error while deleting tweet");
  }

  await Like.deleteMany({tweet: deletedTweet._id});
  await Comment.deleteMany({tweet: deletedTweet._id});

  return res
    .status(200)
    .json(new apiResponse(200, { deletedTweet }, "Tweet deleted Successfully"));
});

export { createTweet, updateTweet, getTweetById, getAllTweets, deleteTweet };
