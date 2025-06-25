import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice.js";
import subscriptionSlice from "./slices/subscriptionSlice.js"

const store = configureStore({
  reducer: {
    auth: authSlice,
    subscription: subscriptionSlice,
  },
});

export default store;
