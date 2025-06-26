import { createSlice } from "@reduxjs/toolkit";

const likeSlice = createSlice({
  name: "like",
  initialState: {
    likedVideos: [], 
    dislikedVideos: [],
    likeCounts: {},
  },
  reducers: {
    setLikedVideos(state, action) {
      state.likedVideos = action.payload;
    },
    toggleLike(state, action) {
      const { videoId } = action.payload;

      const isLiked = state.likedVideos.includes(videoId);
      if (isLiked) {
        state.likedVideos = state.likedVideos.filter((id) => id !== videoId);
        state.likeCounts[videoId] = Math.max(
          0,
          (state.likeCounts[videoId] || 1) - 1
        );
      } else {
        state.likedVideos.push(videoId);
        state.likeCounts[videoId] = (state.likeCounts[videoId] || 0) + 1;

        // Optional: remove dislike if any
        state.dislikedVideos = state.dislikedVideos.filter(
          (id) => id !== videoId
        );
      }
    },
    setLikeCount(state, action) {
      const { videoId, count } = action.payload;
      state.likeCounts[videoId] = count;
    },
    toggleDislike(state, action) {
      const { videoId } = action.payload;

      const isDisliked = state.dislikedVideos.includes(videoId);
      if (isDisliked) {
        state.dislikedVideos = state.dislikedVideos.filter(
          (id) => id !== videoId
        );
      } else {
        state.dislikedVideos.push(videoId);
        state.likedVideos = state.likedVideos.filter((id) => id !== videoId);
        state.likeCounts[videoId] = Math.max(
          0,
          (state.likeCounts[videoId] || 1) - 1
        );
      }
    },
  },
});

export const { setLikedVideos, toggleLike, setLikeCount, toggleDislike } =
  likeSlice.actions;

export default likeSlice.reducer;
