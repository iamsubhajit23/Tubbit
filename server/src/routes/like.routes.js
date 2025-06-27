import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getLikedVideos,
  getTotalLikesOnVideo,
  toggleLikeOnComment,
  toggleLikeOnTweet,
  toggleLikeOnVideo,
} from "../controllers/like.controller.js";

const router = Router();

router.route("/toggle-video-like/:videoId").post(verifyJWT, toggleLikeOnVideo);

router.route("/toggle-comment-like/:commentId").post(verifyJWT, toggleLikeOnComment);

router.route("/toggle-tweet-like/:tweetId").post(verifyJWT, toggleLikeOnTweet);

router.route("/video-likes/:videoId").get(getTotalLikesOnVideo);

router.route("/liked-videos").get(verifyJWT, getLikedVideos);

export default router;
