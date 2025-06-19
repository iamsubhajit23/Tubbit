import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  getAllTweets,
  getTweetById,
  updateTweet,
} from "../controllers/tweet.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/create").post(
  verifyJWT,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
  ]),
  createTweet
);

router.route("/update/:tweetId").patch(verifyJWT, updateTweet);

router.route("/delete/:tweetId").delete(verifyJWT, deleteTweet);

router.route("/id/:tweetId").get(verifyJWT, getTweetById);

router.route("/").get(getAllTweets);

export default router;
