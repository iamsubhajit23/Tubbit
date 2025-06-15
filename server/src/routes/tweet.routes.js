import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getTweetById,
  getUserAllTweets,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/create").post(
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createTweet
);

router.route("/update/:tweetId").patch(updateTweet);

router.route("/delete/:tweetId").delete(deleteTweet);

router.route("/id/:tweetId").get(getTweetById);

router.route("/").get(getUserAllTweets);

export default router;
