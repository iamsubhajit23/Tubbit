import { Router } from "express";
import {
  changeUserPassword,
  getCurrentUser,
  getUserChannelProfile,
  getUserWatchHistory,
  refreshAccessToken,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserDetails,
  userLogIn,
  userLogOut,
  userRegister,
} from "../controllers/user.controller.js";
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

//secure routes
router.route("/logout").post(verifyJWT, userLogOut);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJWT, changeUserPassword);

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

export default router;
