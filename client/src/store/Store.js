import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice.js";
import subscriptionSlice from "./slices/subscriptionSlice.js";
import likeSlice from "./slices/likeSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    subscription: subscriptionSlice,
    like: likeSlice,
  },
});

export default store;
