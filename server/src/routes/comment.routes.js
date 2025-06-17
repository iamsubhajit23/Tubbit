import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addCommentOnTweet,
  addCommentOnVideo,
  deleteTweetComment,
  deleteVideoComment,
  getTweetComments,
  getVideoComments,
  updateTweetComment,
  updateVideoComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/video/add-comment/:videoId").post(verifyJWT, addCommentOnVideo);

router
  .route("/video/update-comment/:commentId")
  .patch(verifyJWT, updateVideoComment);

router
  .route("/video/delete-comment/:commentId")
  .delete(verifyJWT, deleteVideoComment);

router.route("/video/all-comments/:videoId").get(getVideoComments);

router.route("/tweet/add-comment/:tweetId").post(verifyJWT, addCommentOnTweet);

router
  .route("/tweet/update-comment/:commentId")
  .patch(verifyJWT, updateTweetComment);

router
  .route("/tweet/delete-comment/:commentId")
  .delete(verifyJWT, deleteTweetComment);

router.route("/tweet/all-comments/:tweetId").get(getTweetComments);

export default router;
