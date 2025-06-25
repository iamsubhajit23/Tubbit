import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannel,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();

router
  .route("/channel/:channelId")
  .post(verifyJWT, toggleSubscription)
  .get(getUserChannelSubscribers);

router.route("/channel").get(verifyJWT, getSubscribedChannel);

export default router;
