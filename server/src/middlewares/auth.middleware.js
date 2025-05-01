import { User } from "../models/user.models.js";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import JWT from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      
    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshtoken"
    );

    if (!user) {
      throw new apiError(401, "Invalid access token");
    }

    req.user = user;
    next();
    
  } catch (error) {
    throw new apiError(401, error?.message || "Invalid access request");
  }
});
