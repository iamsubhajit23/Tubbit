import api from "../api.js";
import successToast from "../../utils/notification/success";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

const addCommentOnVideo = async (videoId, comment) => {
  try {
    if (!videoId) {
      console.log("Video id is required to comment on video");
    }

    if (!comment) {
      return apiErrorHandler(null, "Comment is required");
    }

    const res = await api.post(`/comment/video/add-comment/${videoId}`, {
      comment,
    });

    if (![200, 201].includes(res.status)) {
      return console.log("Failed to add comment on video");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const updateVideoComment = async (commentId, comment) => {
  try {
    if (!commentId) {
      return console.log("Comment id is required to update comment on video");
    }

    if (!comment) {
      return apiErrorHandler(null, "Comment is required");
    }

    const res = await api.patch(`/comment/video/update-comment/${commentId}`, {
      comment,
    });

    if (res.status !== 200) {
      return console.log("Failed to update comment on video");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const deleteVideoComment = async (commentId) => {
  try {
    if (!commentId) {
      return console.log("Comment id is required to delete comment on video");
    }

    const res = await api.delete(`/comment/video/delete-comment/${commentId}`);

    if (res.status !== 200) {
      return console.log("Failed to delete comment on video");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getVideoComments = async (videoId) => {
  try {
    if (!videoId) {
      return console.log("Video id is required to fetch video comments");
    }

    const res = await api.get(`/comment/video/all-comments/${videoId}`);

    if (res.status !== 200) {
      return console.log("Failed to fetch video comments");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const addCommentOnTweet = async (tweetId, comment) => {
  try {
    if (!tweetId) {
      return console.log("Tweet id is required to add comment on tweet");
    }

    if (!comment) {
      return console.log("Comment is required");
    }

    const res = await api.post(`/comment/tweet/add-comment/${tweetId}`, {
      comment,
    });

    if (![200, 201].includes(res.status)) {
      return console.log("Failed to add comment on tweet");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const updateTweetComment = async (commentId, comment) => {
  try {
    if (!commentId) {
      return console.log("Comment id is required to update comment on tweet");
    }

    if (!comment) {
      return console.log("Comment is required");
    }

    const res = await api.patch(`/comment/tweet/update-comment/${commentId}`, {
      comment,
    });

    if (res.status !== 200) {
      return console.log("Failed to update comment on tweet");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const deleteTweetComment = async (commentId) => {
  try {
    if (!commentId) {
      return console.log("Comment id is required to delete comment on tweet");
    }

    const res = await api.delete(`/comment/tweet/delete-comment/${commentId}`);

    if (res.status !== 200) {
      return console.log("Failed to delete comment from tweet");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getTweetComments = async (tweetId) => {
  try {
    if (!tweetId) {
      return console.log("Tweet id required to fetch tweet comments");
    }

    const res = await api.get(`/comment/tweet/all-comments/${tweetId}`);

    if (res.status !== 200) {
      return console.log("Failed to fetch tweet comment");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

export {
  addCommentOnVideo,
  updateVideoComment,
  deleteVideoComment,
  getVideoComments,
  addCommentOnTweet,
  updateTweetComment,
  deleteTweetComment,
  getTweetComments,
};
