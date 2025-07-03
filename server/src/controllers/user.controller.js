import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import JWT from "jsonwebtoken";
import mongoose from "mongoose";
import { deleteLocalFile } from "../utils/deleteLocalFile.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshtoken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating access token or refresh token"
    );
  }
};

const userRegister = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;
  //field validation
  if (
    [username, email, fullname, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required!");
  }

  //user validation
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(400, "User with same email or username already exists!");
  }

  //create user object on db
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullname,
    password,
  });

  //user validation and removing password and refreshtoken from response
  const createdUser = await User.findById(user._id).select(
    "-password -refreshtoken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user!");
  }

  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "User registered Successfully"));
});

const userLogIn = asyncHandler(async (req, res) => {
  // get data from body(user)
  const { username, email, password } = req.body;

  //validate data
  if (!username || !email) {
    throw new apiError(400, "both username and email are required");
  }
  //find the user
  const user = await User.findOne({
    $and: [{ username }, { email }],
  });

  //validate user
  if (!user) {
    throw new apiError(404, "User does not exist!");
  }

  //validate password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(401, "Password is invalid");
  }

  //accessToken and refreshToken
  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshtoken -watchhistory"
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  //sending response
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshtoken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedinUser,
        },
        "User Logged In Successfully"
      )
    );
});

const userLogOut = asyncHandler(async (req, res) => {
  //removing refreshtoken
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshtoken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshtoken", options)
    .json(new apiResponse(200, {}, "User logged out Successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshtoken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "Unauthorized request!");
  }

  const decodedRefreshToken = JWT.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  console.log("decodedRefreshToken: ", decodedRefreshToken);

  const user = await User.findById(decodedRefreshToken._id);
  if (!user) {
    throw new apiError(401, "Invalid refresh token!");
  }

  if (incomingRefreshToken !== user?.refreshtoken) {
    throw new apiError(401, "Refresh token is expired or used!");
  }

  const { accessToken, newRefreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("newRefreshToken", newRefreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          accessToken,
          refreshToken: newRefreshToken,
        },
        "Access token refreshed Successfully!"
      )
    );
});

const changeUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new apiError(401, "oldPassword and newPassword both are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new apiError(400, "Invalid user access request!");
  }
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); // return true or false

  if (!isPasswordCorrect) {
    throw new apiError(400, "Enter correct old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password changed Successfully!"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-refreshtoken -password"
  );

  if (!user) {
    throw new apiError(401, "Invalid request to get user details!");
  }

  return res
    .status(200)
    .json(
      new apiResponse(201, user, "Current User details fetched successfully")
    );
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname && !email) {
    throw new apiError(401, "Fullname or Email is required!");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password -refreshtoken");

  return res
    .status(200)
    .json(new apiResponse(200, user, "User details update Successfully!"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(401, "Avatar file is required!");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath); // return response.url

  if (!avatar.url) {
    deleteLocalFile(avatarLocalPath);
    throw new apiError(400, "Error, while updating avatar!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Avatar is updated Successfully!"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverimageLocalPath = req.file?.path;

  if (!coverimageLocalPath) {
    throw new apiError(401, "Cover image is required!");
  }

  const coverImage = await uploadOnCloudinary(coverimageLocalPath);

  if (!coverImage.url) {
    deleteLocalFile(coverimageLocalPath);
    throw new apiError(401, "Error, while uploading cover Image!");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverimage: coverImage.url,
      },
    },
    {
      new: true,
    }
  ).select("-password");

  return res
    .status(200)
    .json(new apiResponse(200, user, "Cover Image updated Successfully!"));
});

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username) {
    throw new apiError(400, "Username is required");
  }

  const channel = await User.aggregate([
    {
      $match: {
        username: username,
      },
    },
    {
      // go to the subscriptions collection and matches channel with the _id of this user
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      // go to the subscriptions collection and matches subscriber with the _id of this user
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelSubscribedToCount: {
          $size: "$subscribedTo",
        },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] }, //note: this line asks that either current user present in subscribers or not?
            then: true,
            else: false,
          },
        },
      },
    },
    {
      // Chooses which fields to include in the final output. 1 means include the field
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverimage: 1,
        email: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!channel.length) {
    throw new apiError(404, "Channel does not exist");
  }

  return res
    .status(200)
    .json(
      new apiResponse(200, channel[0], "User channel fetched Successfully!")
    );
});

const getUserWatchHistory = asyncHandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: req.user._id,
      },
    },
    {
      $unwind: "$watchhistory",
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchhistory.video",
        foreignField: "_id",
        as: "video",
      },
    },
    {
      $unwind: "$video",
    },
    {
      $lookup: {
        from: "users",
        localField: "video.owner",
        foreignField: "_id",
        as: "video.owner",
        pipeline: [
          {
            $project: {
              fullname: 1,
              username: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        "video.owner": { $first: "$video.owner" },
      },
    },
    {
      $project: {
        _id: 0,
        watchedAt: "$watchhistory.watchedat",
        video: "$video",
      },
    },
    {
      $sort: { watchedAt: -1 },
    },
  ]);

  return res
    .status(200)
    .json(new apiResponse(200, user, "Watch History fetched Successfully!"));
});

const addVideoToWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { videoId } = req.params;

  if (!videoId) {
    throw new apiError(400, "Video ID is required");
  }

  const user = await User.findById(userId);

  user.watchhistory = user.watchhistory.filter((entry) => {
    if (typeof entry === "object" && entry.video) {
      return entry.video.toString() !== videoId;
    } else if (entry && entry.toString) {
      return entry.toString() !== videoId;
    }
    return true;
  });

  user.watchhistory.unshift({
    video: videoId,
    watchedAt: new Date(),
  });

  if (user.watchhistory.length > 100) {
    user.watchhistory = user.watchhistory.slice(0, 100);
  }

  await user.save();

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { watchhistory: user.watchhistory },
        "Watch history updated"
      )
    );
});

export {
  userRegister,
  userLogIn,
  userLogOut,
  refreshAccessToken,
  changeUserPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getUserWatchHistory,
  addVideoToWatchHistory,
};
