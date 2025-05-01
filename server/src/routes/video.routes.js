import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  togglePublishStatus,
  updateThumbnail,
  updateVideoInfo,
  uploadVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/").get(getAllVideos);

router.route("/upload-video").post(
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
  .delete(deleteVideo)
  .patch(updateVideoInfo)

router
  .route("/:videoId/thumbnail")
  .patch(upload.single("thumbnail"), updateThumbnail)  

router.route("/:videoId/publish-status")
  .patch(togglePublishStatus);
export default router;
