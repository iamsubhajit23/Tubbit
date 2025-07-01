import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose, { model } from "mongoose";

const toggleLikeOnVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Valid video ID is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "Video not found");
  }

  const existingLike = await Like.findOne({
    likedby: userId,
    video: videoId,
  });

  if (!existingLike) {
    await Like.create({
      likedby: userId,
      video: videoId,
    });

    return res
      .status(200)
      .json(new apiResponse(200, {}, "Video Liked Successfully"));
  }

  await Like.findOneAndDelete({
    likedby: userId,
    video: videoId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Video unliked Successfully"));
});

const toggleLikeOnComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!commentId || !mongoose.Types.ObjectId.isValid(commentId)) {
    throw new apiError(400, "Valid comment id is required");
  }

  const existingLike = await Like.findOne({
    likedby: userId,
    comment: commentId,
  });

  if (!existingLike) {
    await Like.create({
      likedby: userId,
      comment: commentId,
    });

    return res
      .status(200)
      .json(new apiResponse(200, {}, "Comment Like Successfully"));
  }

  await Like.findOneAndDelete({
    likedby: userId,
    comment: commentId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Comment unlike Successfully"));
});

const toggleLikeOnTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const existingLike = await Like.findOne({
    likedby: userId,
    tweet: tweetId,
  });

  if (!existingLike) {
    await Like.create({
      likedby: userId,
      tweet: tweetId,
    });

    return res
      .status(200)
      .json(new apiResponse(200, {}, "Tweet like Successfully"));
  }

  await Like.findOneAndDelete({
    likedby: tweetId,
    tweet: tweetId,
  });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Tweet unlike Successfully"));
});

const getTotalLikesOnVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !mongoose.Types.ObjectId.isValid(videoId)) {
    throw new apiError(400, "Valid video id is required");
  }

  const likes = await Like.countDocuments({
    video: videoId,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { totalLikes: likes },
        "Total likes fetched Successfully"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const likedVideo = await Like.find({
    likedby: userId,
    video: { $ne: null },
  })
    .sort({ createdAt: -1 })
    .populate({
      path: "video",
      populate: {
        path: "owner",
        model: "User",
        select: "username fullname avatar",
      },
    });

  if (!likedVideo || likedVideo.length == 0) {
    throw new apiError(404, "You have not liked any video");
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        totalLikedVideo: likedVideo.length,
        likedVideos: likedVideo,
      },
      "Liked videos fetched Successfully"
    )
  );
});

const getTotalLikesOnTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId || !mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new apiError(400, "Valid tweet id is required");
  }

  const likes = await Like.countDocuments({
    tweet: tweetId,
  });

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { totalLikes: likes },
        "Total likes fetched Successfully"
      )
    );
});

//TODO: totalLikeOnComment,getLikedTweet

export {
  toggleLikeOnVideo,
  toggleLikeOnComment,
  toggleLikeOnTweet,
  getTotalLikesOnVideo,
  getLikedVideos,
  getTotalLikesOnTweet,
};
