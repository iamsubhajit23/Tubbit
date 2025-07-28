import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  getVideoDownloadLink,
  togglePublishStatus,
  updateThumbnail,
  updateVideoInfo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();


router.route("/").get(getAllVideos);

router.route("/upload-video").post(
  verifyJWT,
  upload.fields([
    {
      name: "videofile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

router
  .route("/id/:videoId")
  .get(getVideoById)
  .delete(verifyJWT, deleteVideo)
  .patch(verifyJWT, updateVideoInfo);

router
  .route("/:videoId/thumbnail")
  .patch(verifyJWT, upload.single("thumbnail"), updateThumbnail);

router.route("/:videoId/publish-status").patch(verifyJWT, togglePublishStatus);

router.route("/download/:publicId").get(verifyJWT, getVideoDownloadLink)

export default router;
