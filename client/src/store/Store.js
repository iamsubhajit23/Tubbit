import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./AuthSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
