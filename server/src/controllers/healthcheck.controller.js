import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import connectDB from "../database/index.js";

const healthcheck = asyncHandler(async (_, res) => {
  const state = mongoose.connection.readyState;
  console.log("Database Connection Status: ", state);

  if (state !== 1) {
    return res.status(500).json(
      new apiResponse(
        500,
        {
          uptime: process.uptime(),
          timestamp: new Date().toISOString(),
          database: "Disconnected",
        },

        "Server Issue"
      )
    );
  }

  return res.status(200).json(
    new apiResponse(
      200,
      {
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: "Connected",
      },
      "OK"
    )
  );
});

export { healthcheck };
