import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Video } from "../models/video.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Subscription } from "../models/subscription.models.js";
import { Like } from "../models/like.model.js";
import { Playlist } from "../models/playlist.model.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelInsights = asyncHandler(async (req, res) => {
  const userId = req.user._id;

//   const videoandViewsCount = await User.aggregate([
//     {
//       $match: {
//         _id: userId,
//       },
//     },
//     {
//       $lookup: {
//         from: "videos",
//         localField: "_id",
//         foreignField: "owner",
//         as: "videos", // Brings all videos where owner == userId
//       },
//     },
//     {
//         $addFields: {
//             totalVideos: { $size: "$videos"}, // Count number of videos
//             totalViews: { $sum: "$videos.views"}, // Sum views of all videos
//         }
//     },
//     {
//         $project: {
//             totalVideos: 1,
//             totalViews: 1
//         }
//     }
//   ]);

//   const videosAndViewsCount = await Video.aggregate([
//     {
//         $match: {
//             owner: userId
//         }
//     },
//     {
//         $group: {
//             _id: "$owner",
//             totalVideos: {$sum: 1},
//             totalViews: {$sum: "$views"}
//         }
//     },
//     {
//         $project: {
//             _id: 0,
//             totalVideos: 1,
//             totalViews: 1
//         }
//     }
//   ])

//   const videosLikesCount = await Like.aggregate([
//     {
//        $lookup: {
//         from: "videos",
//         localField: "video",
//         foreignField: "_id",
//         as: "videoDetails"
//        }
//     }, 
//     {
//         $unwind: "$videoDetails"
//     },
//     {
//         $match: {
//             "videoDetails.owner": userId 
//         }
//     },
//     {
//         $group: {
//             _id: null,
//             totalLikes: {$sum: 1}
//         }
//     }, 
//     {
//         $project: {
//             _id: 0,
//             totalLikes: 1
//         }
//     }
//   ])
  
//   const subscribersCount = await Subscription.countDocuments(
//     {
//         channel: userId
//     }
//   )

  const [videosAndViewsCount, videosLikesCount, subscribersCount] = await Promise.all([
    Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $group: {
                _id: "$owner",
                totalVideos: {$sum: 1},
                totalViews: {$sum: "$views"}
            }
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1
            }
        }
    ]),
    Like.aggregate([
        {
           $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "videoDetails"
           }
        }, 
        {
            $unwind: "$videoDetails"
        },
        {
            $match: {
                "videoDetails.owner": userId 
            }
        },
        {
            $group: {
                _id: null,
                totalLikes: {$sum: 1}
            }
        }, 
        {
            $project: {
                _id: 0,
                totalLikes: 1
            }
        }
    ]),
    Subscription.countDocuments(
        {
            channel: userId
        }
    )
  ])

  const videosCount = videosAndViewsCount[0]?.totalVideos || 0 ;
  const viewsCount = videosAndViewsCount[0]?.totalViews || 0 ;
  const likesCount = videosLikesCount[0]?.totalLikes || 0;

  return res 
  .status(200)
  .json(
    new apiResponse(
        200,
        {
            videosCount,
            viewsCount,
            likesCount,
            subscribersCount : subscribersCount || 0,
        },
        "Dashboard fetched Successfully"
    )
  )

});

export {
    getChannelInsights,
}
