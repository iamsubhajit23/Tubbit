import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  togglePublishStatus,
  updatePlaylistInfo,
} from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT);


router.route("/create").post(createPlaylist);

router.route("/add-video/:playlistId/:videoId").patch(addVideoToPlaylist);

router
  .route("/remove-video/:playlistId/:videoId")
  .patch(removeVideoFromPlaylist);

router.route("/update-playlist/:playlistId").patch(updatePlaylistInfo);

router.route("/:playlistId").get(getPlaylistById);

router.route("/").get(getUserPlaylists);

router.route("/toggle-status/:playlistId").patch(togglePublishStatus);

router.route("/delete-playlist/:playlistId").delete(deletePlaylist);


export default router;