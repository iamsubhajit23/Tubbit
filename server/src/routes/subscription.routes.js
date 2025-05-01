import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getSubscribedChannel,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/channel/:channelId")
  .post(toggleSubscription)
  .get(getUserChannelSubscribers);

router.route("/channel").get(getSubscribedChannel);

export default router;
