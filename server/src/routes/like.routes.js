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
router.use(verifyJWT);

router.route("/toggle-video-like/:videoId").post(toggleLikeOnVideo);

router.route("/toggle-comment-like/:commentId").post(toggleLikeOnComment);

router.route("/toggle-tweet-like/:tweetId").post(toggleLikeOnTweet);

router.route("/video-likes/:videoId").get(getTotalLikesOnVideo);

router.route("/liked-videos").get(getLikedVideos);

export default router;
