import mongoose from "mongoose";
import sanitizeHtml from "sanitize-html";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";

const addCommentOnVideo = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Valid video id is required");
  }
  if (!comment) {
    throw new apiError(400, "Comment is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  const sanitizedComment = sanitizeHtml(comment, {
    allowedTags: [], // No HTML tags allowed
    allowedAttributes: {}, // No attributes allowed
  });

  const createdComment = await Comment.create({
    content: sanitizedComment,
    video: videoId,
    owner: userId,
  });

  const newComment = await Comment.findById(createdComment._id).populate("owner", "username avatar");

  if (!newComment) {
    throw new apiError(501, "Error while add comment on video");
  }

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        { comment: newComment },
        "Comment added Successfully"
      )
    );
});

const updateVideoComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { comment } = req.body;
  const userId = req.user._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Valid Comment id is required");
  }
  if (!comment) {
    throw new apiError(400, "Comment is required");
  }

  const existingComment = await Comment.findOne({
    _id: commentId,
    video: { $exists: true, $ne: null },
  });

  if (!existingComment) {
    throw new apiError(404, "No video comment found for this id");
  }

  if (existingComment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to update comment");
  }

  const sanitizedComment = sanitizeHtml(comment, {
    allowedTags: [],
    allowedAttributes: [],
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content: sanitizedComment,
      },
    },
    {
      new: true,
    }
  ).populate("owner", "username avatar");

  if (!updatedComment) {
    throw new apiError(404, "No comment found for this comment id");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { updatedComment: updatedComment },
        "Comment updated Successfully"
      )
    );
});

const deleteVideoComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Valid comment id is required");
  }

  const existingComment = await Comment.findOne({
    _id: commentId,
    video: { $exists: true, $ne: null },
  });
  if (!existingComment) {
    throw new apiError(404, "No video comment found with this id");
  }

  if (existingComment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to delete comment");
  }

  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Comment deleted Successfully"));
});

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Valid video id is required");
  }

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new apiError(404, "No video found for this video id");
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    populate: {
      path: "owner",
      select: "username avatar",
    },
  };

  const result = await Comment.paginate({ video: videoId }, options);

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalDocs: result.totalDocs,
        comments: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
      },
      "Comments fetched successfully"
    )
  );
});

const addCommentOnTweet = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!comment) {
    throw new apiError(400, "Comment is required");
  }
  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const existingTweet = await Tweet.findById(tweetId);

  if (!existingTweet) {
    throw new apiError(404, "No found any tweet with this tweet id");
  }

  const sanitizedComment = sanitizeHtml(comment, {
    allowedAttributes: [],
    allowedTags: [],
  });

  const createdComment = await Comment.create({
    content: sanitizedComment,
    tweet: tweetId,
    owner: userId,
  });

  if (!createdComment) {
    throw new apiError(500, "Error while add comment on tweet");
  }

  const newComment = await Comment.findById(createdComment._id).populate("owner", "username avatar");

  return res
    .status(201)
    .json(
      new apiResponse(
        201,
        { comment: newComment },
        "Add comment on tweet Successfully"
      )
    );
});

const updateTweetComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!comment) {
    throw new apiError(400, "Comment is required");
  }
  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Valid comment id is required");
  }

  const existingComment = await Comment.findOne({
    _id: commentId,
    tweet: { $exists: true, $ne: null },
  });

  if (!existingComment) {
    throw new apiError(404, "No tweet comment found with this id");
  }

  if (existingComment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to update comment");
  }

  const sanitizedComment = sanitizeHtml(comment, {
    allowedAttributes: [],
    allowedTags: [],
  });

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      content: sanitizedComment,
    },
    { new: true }
  ).populate("owner", "username avatar");

  if (!updatedComment) {
    throw new apiError(500, "Error while updating tweet comment");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { updatedComment },
        "Tweet comment updated Successfully"
      )
    );
});

const deleteTweetComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Valid comment id is required");
  }

  const existingComment = await Comment.findOne({
    _id: commentId,
    tweet: { $exists: true, $ne: null },
  });

  if (!existingComment) {
    throw new apiError(404, "No tweet comment found with this id");
  }

  if (existingComment.owner.toString() !== userId.toString()) {
    throw new apiError(403, "You are not authorized to delete this comment");
  }
  await Comment.findByIdAndDelete(commentId);

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Tweet comment deleted Successfully"));
});

const getTweetComments = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const existingTweet = await Tweet.findById(tweetId);

  // if (!existingTweet) {
  //   throw new apiError(404, "No tweet found with this tweet id");
  // }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: {
      path: "owner",
      select: "username avatar",
    },
  };

  const result = await Comment.paginate(
    {
      tweet: tweetId,
    },
    options
  );

  // if (!result.docs || result.docs.length === 0) {
  //   throw new apiError(404, "No comments found for this tweet");
  // }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalDocs: result.totalDocs,
        comments: result.docs,
        totalPages: result.totalPages,
        currentPage: result.page,
      },
      "All comments fetched Successfully"
    )
  );
});

export {
  addCommentOnVideo,
  updateVideoComment,
  deleteVideoComment,
  getVideoComments,
  addCommentOnTweet,
  updateTweetComment,
  deleteTweetComment,
  getTweetComments
};
