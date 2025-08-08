import { Router } from "express";
import passport from "passport";
import {
  addVideoToWatchHistory,
  changeUserPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserWatchHistory,
  handleSocialLogin,
  refreshAccessToken,
  resetPassword,
  resetPasswordEmailOtp,
  sendEmailOtp,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserDetails,
  userLogIn,
  userLogOut,
  userRegister,
  verifyEmailOtp,
} from "../controllers/user.controller.js";
import "../passport/index.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  userRegister
);

router.route("/login").post(userLogIn);

router.route("/logout").post(verifyJWT, userLogOut);

router.route("/send-email-otp").post(sendEmailOtp);

router.route("/verify-email-otp").post(verifyEmailOtp);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeUserPassword);

router.route("/reset-password-email-otp").post(resetPasswordEmailOtp);

router.route("/reset-password").post(resetPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);

router.route("/update-account").patch(verifyJWT, updateUserDetails);

router
  .route("/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-cover")
  .put(verifyJWT, upload.single("coverimage"), updateUserCoverImage);

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile);

router.route("/watchhistory").get(verifyJWT, getUserWatchHistory);

router
  .route("/add-video-to-watch-history/:videoId")
  .post(verifyJWT, addVideoToWatchHistory);

// SSO routes
router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
  (_, res) => {
    res.send("Redirecting to google...");
  }
);

router.route("/github").get(
  passport.authenticate("github", {
    scope: ["user:email"],
  }),
  (_, res) => {
    res.send("Redirecting to github...");
  }
);

router
  .route("/google/callback")
  .get(passport.authenticate("google"), handleSocialLogin);

router
  .route("/github/callback")
  .get(passport.authenticate("github"), handleSocialLogin);

export default router;
