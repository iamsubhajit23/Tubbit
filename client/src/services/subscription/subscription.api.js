import api from "../api.js";
import successToast from "../../utils/notification/success.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

const toggleSubscription = async (channelId) => {
  try {
    const res = await api.post(`/subscription/channel/${channelId}`);

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to toggle subscription. Try again");
    }

    successToast(
      `You are subscribed to ${res?.data?.channel?.fullname || "the channel"}`
    );
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to toggle subscription");
  }
};

const getSubscribers = async (channelId) => {
  try {
    if (!channelId) {
      return apiErrorHandler(null, "Channel id required");
    }

    const res = await api.get(`/subscription/channel/${channelId}`);

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to fetch subscribers. Try again");
    }

    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to fetch subscribers");
  }
};

const getSubscribedChannel = async () => {
  try {
    const res = await api.get("/subscription/channel");

    if (res.status !== 200) {
      return apiErrorHandler(
        null,
        "Failed to fetch your subscribed channel. Try again"
      );
    }
    
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "You haven't subscribe any channel yet");
  }
};

export { toggleSubscription, getSubscribers, getSubscribedChannel };
