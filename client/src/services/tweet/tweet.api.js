import api from "../api.js";
import successToast from "../../utils/notification/success.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";

const createTweet = async (content) => {
  try {
    if (!content) {
      return console.log(
        "SERVICES :: ERROR: Content is required to create tweet"
      );
    }

    const res = await api.post("/tweet/create/", { content });

    if (![200, 201].includes(res.status)) {
      return console.log("SERVICES :: ERROR: Failed to create Tweet");
    }
    successToast("Tweet created successfully");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const updateTweet = async (content, tweetId) => {
  try {
    if (!tweetId) {
      return console.log(
        "SERVICES :: ERROR: Tweet id is required to update Tweet"
      );
    }
    if (!content) {
      return console.log(
        "SERVICES :: ERROR: Content is required to update Tweet"
      );
    }

    const res = await api.patch(`/tweet/update/${tweetId}`, { content });

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to update your tweet");
    }

    successToast("Tweet content is updated");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const deleteTweet = async (tweetId) => {
  try {
    if (!tweetId) {
      return console.log(
        "SERVICES :: ERROR: Tweet id is required to delete Tweet"
      );
    }

    const res = await api.delete(`/tweet/delete/${tweetId}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to delete your tweet");
    }

    successToast("Tweet deleted successfully");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getTweetById = async (tweetId) => {
  try {
    if (!tweetId) {
      return console.log(
        "SERVICES :: ERROR: Tweet id is required to get Tweet"
      );
    }

    const res = await api.get(`/tweet/id/${tweetId}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to fetch tweet");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getUserAllTweets = async (userId) => {
  try {
    const endpoint = userId ? `/tweet/${userId}` : `/tweet`;

    const res = await api.get(`/tweet/${endpoint}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to fetch tweets");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};
