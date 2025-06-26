import api from "../api.js";
import errorToast from "../../utils/notification/error.js";

const toggleSubscription = async (channelId) => {
  try {
    const res = await api.post(`/subscription/channel/${channelId}`);

    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message;
    errorToast(message);
    return null;
  }
};

const getSubscribers = async (channelId) => {
  try {
    if (!channelId) {
      return;
    }
    const res = await api.get(`/subscription/channel/${channelId}`);
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message;
    errorToast(message);
    return null;
  }
};

const getSubscribedChannel = async () => {
  try {
    const res = await api.get("/subscription/channel");

    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message;
    console.log(message);
    return null;
  }
};

export { toggleSubscription, getSubscribers, getSubscribedChannel };
