import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedVideos: [],
  },
  reducers: {
    setLikedVideos(state, action) {
      state.likedVideos = action.payload;
    },
    toggleLike(state, action) {
      const videoId = action.payload;

      if (!state.likedVideos.includes(videoId)) {
        state.likedVideos.push(videoId);
      }
    },
  },
});

export const { setLikedVideos, toggleLike } = likeSlice.actions;

export default likeSlice.reducer;
