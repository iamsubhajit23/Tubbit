import { createSlice } from "@reduxjs/toolkit";

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscribedChannels: [],
  },
  reducers: {
    setSubscribedChannels(state, action) {
      state.subscribedChannels = action.payload;
    },
    toggleSubscribedChannel(state, action) {
      const channelId = action.payload;
      if (state.subscribedChannels.includes(channelId)) {
        state.subscribedChannels = state.subscribedChannels.filter(
          (id) => id !== channelId
        );
      } else {
        state.subscribedChannels.push(channelId);
      }
    },
  },
});

export const { setSubscribedChannels, toggleSubscribedChannel } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
