import { Video } from "../models/video.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import mongoose from "mongoose";
import { deleteLocalFile } from "../utils/deleteLocalFile.js";

const uploadVideo = asyncHandler(async (req, res) => {
  const videoLocalPath = req.files?.videofile[0]?.path;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!videoLocalPath) {
    deleteLocalFile(thumbnailLocalPath);
    throw new apiError(401, "Video is required");
  }

  if (!title) {
    deleteLocalFile(thumbnailLocalPath);
    deleteLocalFile(videoLocalPath);
    throw new apiError(401, "Title is required!");
  }

  if (!thumbnailLocalPath) {
    deleteLocalFile(videoLocalPath);
    throw new apiError(401, "Thumbnail is required");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    deleteLocalFile(thumbnailLocalPath);
    deleteLocalFile(videoLocalPath);
    throw new apiError(401, "User not found with this user id");
  }

  // upload video and thumbnail on cloudinary
  const videoFile = await uploadOnCloudinary(videoLocalPath);

  if (!videoFile.secure_url) {
    throw new apiError(400, "Error while uploading video on cloudinary!");
  }

  if (!videoFile.duration) {
    throw new apiError(404, "Video duration not found");
  }

  const thumbnailFile = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnailFile.secure_url) {
    throw new apiError(400, "Error while uploading thumbnail on cloudinary!");
  }

  //create video object on db
  const video = await Video.create({
    videofile: videoFile.secure_url,
    thumbnail: thumbnailFile.secure_url,
    title,
    description,
    duration: videoFile.duration,
    videofilepublicid: videoFile.public_id,
    thumbnailpublicid: thumbnailFile.public_id,
    owner: user._id,
  });

  const createdVideo = await Video.findById(video._id);

  if (!createdVideo) {
    throw new apiError(500, "Error while upload video");
  }

  return res
    .status(200)
    .json(new apiResponse(200, createdVideo, "Video uploaded Successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new apiError(400, "videoId is required");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username fullname avatar"
  );

  if (!video) {
    throw new apiError(404, "No Video found with this Video Id!");
  }

  video.views += 1;
  await video.save();

  return res
    .status(200)
    .json(new apiResponse(200, video, "Video fetched Successfully"));
});

const getAllVideos = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    query,
    sortBy = "views",
    sortType = "desc",
    userId,
  } = req.query;

  const sortOptions = {};
  sortOptions[sortBy] = sortType === "desc" ? -1 : 1;

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: sortOptions,
  };

  let match = { ispublished: true };
  let related = false;
  let fallback = null;

  if (query) {
    match.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
    ];
  }

  if (userId) {
    match.owner = new mongoose.Types.ObjectId(userId);
  }

  // First attempt
  let aggregate = Video.aggregate([
    { $match: match },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
      },
    },
    { $unwind: "$owner" },
    {
      $project: {
        "owner.watchhistory": 0,
        "owner.password": 0,
        "owner.refreshtoken": 0,
      },
    },
  ]);

  let { docs, totalDocs, totalPages } = await Video.aggregatePaginate(
    aggregate,
    options
  );

  // Fallback to fuzzy match
  if (!docs || docs.length === 0) {
    const keywords = query?.trim()?.split(/\s+/).filter(Boolean);
    if (keywords.length > 0) {
      const fuzzyRegex = new RegExp(keywords.join("|"), "i");

      match.$or = [
        { title: { $regex: fuzzyRegex } },
        { description: { $regex: fuzzyRegex } },
      ];

      if (userId) {
        match.owner = new mongoose.Types.ObjectId(userId);
      }

      aggregate = Video.aggregate([
        { $match: match },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
          },
        },
        { $unwind: "$owner" },
        {
          $project: {
            "owner.watchhistory": 0,
            "owner.password": 0,
            "owner.refreshtoken": 0,
          },
        },
      ]);

      fallback = await Video.aggregatePaginate(aggregate, options);
      docs = fallback.docs;
      totalDocs = fallback.totalDocs;
      totalPages = fallback.totalPages;
      related = true;
    }
  }

  if (!docs || docs.length === 0) {
    throw new apiError(404, "No videos found");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        { docs, totalDocs, totalPages, related },
        "Videos fetched Successfully!"
      )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    throw new apiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(400, "No found video with this Video id");
  }

  await deleteFromCloudinary(video.videofilepublicid, "video");
  await deleteFromCloudinary(video.thumbnailpublicid, "image");

  const deletedVideo = await Video.findByIdAndDelete(video._id);

  if (!deletedVideo) {
    throw new apiError(500, "Error while deleting video");
  }

  await Like.deleteMany({ video: deletedVideo._id });
  await Comment.deleteMany({ video: deletedVideo._id });

  return res
    .status(200)
    .json(new apiResponse(200, deletedVideo, "Video deleted Successfully"));
});

const updateThumbnail = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const thumbnailLocalPath = req.file?.path;

  if (!videoId) {
    deleteLocalFile(thumbnailLocalPath);
    throw new apiError(400, "Video id is required");
  }
  if (!thumbnailLocalPath) {
    deleteLocalFile(thumbnailLocalPath);
    throw new apiError(400, "Thumbnail is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    deleteLocalFile(thumbnailLocalPath);
    throw new apiError(400, "No video find with this video id");
  }

  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail.secure_url) {
    throw new apiError(400, "Error while uploading thumbnail on Cloudinary");
  }

  // after upload file on cloudinary delete previous one
  await deleteFromCloudinary(video.thumbnailpublicid, "image");

  const updatedVideo = await Video.findByIdAndUpdate(
    video._id,
    {
      $set: {
        thumbnail: thumbnail.secure_url,
        thumbnailpublicid: thumbnail.public_id,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .json(new apiResponse(200, updatedVideo, "Thumbnail updated Successfully"));
});

const updateVideoInfo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { videoId } = req.params;

  if (!title && !description) {
    throw new apiError(400, "Title or description is required");
  }
  if (!videoId) {
    throw new apiError(400, "Video id is required");
  }

  const videoInfo = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        ...(title && { title }),
        ...(description && { description }),
      },
    },
    {
      new: true,
    }
  );

  if (!videoInfo) {
    throw new apiError(400, "No video found with this video id");
  }

  return res
    .status(200)
    .json(new apiResponse(200, videoInfo, "Video Info Updated Successfully!"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video id is required");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new apiError(404, "No video found with this video id");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    video._id,
    {
      $set: {
        ispublished: !video.ispublished,
      },
    },
    {
      new: true,
    }
  );
  if (!updatedVideo) {
    throw new apiError(400, "Error while updating video publish status");
  }

  return res
    .status(200)
    .json(
      new apiResponse(
        200,
        updatedVideo,
        "Video publish status toggled successfully"
      )
    );
});

export {
  uploadVideo,
  getVideoById,
  getAllVideos,
  deleteVideo,
  updateThumbnail,
  updateVideoInfo,
  togglePublishStatus,
};
