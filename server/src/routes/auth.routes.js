import passport from "passport";
import { Router } from "express";
import { generateAccessTokenAndRefreshToken } from "../controllers/user.controller.js";
import { User } from "../models/user.models.js";
import "../controllers/auth/passport.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";

const router = Router();

const issueTokens = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(userId);

    const user = await User.findById(userId).select("-password -refreshtoken");

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    }

    return res
        .status(200)
        .cookie("accesstoken", accessToken, options)
        .cookie("refreshtoken", refreshToken, options)
        .redirect("http://localhost:5173/github/callback")
})

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get("/github/callback", passport.authenticate("github",
    {
        session: false,
        failureRedirect: "/auth"
    }),
    issueTokens
)

export default router;