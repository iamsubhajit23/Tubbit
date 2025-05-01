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
router.use(verifyJWT);

router.route("/video/add-comment/:videoId").post(addCommentOnVideo);

router.route("/video/update-comment/:commentId").patch(updateVideoComment);

router.route("/video/delete-comment/:commentId").delete(deleteVideoComment);

router.route("/video/all-comments/:videoId").get(getVideoComments);

router.route("/tweet/add-comment/:tweetId").post(addCommentOnTweet);

router.route("/tweet/update-comment/:commentId").patch(updateTweetComment);

router.route("/tweet/delete-comment/:commentId").delete(deleteTweetComment);

router.route("/tweet/all-comments/:tweetId").get(getTweetComments);

export default router;
