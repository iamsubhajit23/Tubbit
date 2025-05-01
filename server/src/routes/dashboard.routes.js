import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { getChannelInsights } from "../controllers/dashboard.controller.js";


const router = Router();
router.use(verifyJWT)

router.route("/stats").get(getChannelInsights)

export default router;