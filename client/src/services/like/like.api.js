import api from "../api";

const toggleLikeOnVideo = async (videoId) => {
  try {
    if (!videoId) {
      return console.log("Video id required to toggle like");
    }

    const res = await api.post(`/like/toggle-video-like/${videoId}`);

    if (res.status !== 200) {
      return console.log("Error while toggle like on video");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const toggleLikeOnComment = async (commentId) => {
  try {
    if (!commentId) {
      return console.log("Comment id required to toggle like");
    }

    const res = await api.post(`/like/toggle-comment-like/${commentId}`);

    if (res.status !== 200) {
      return console.log("Error while toggle like on comment");
    }
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const toggleLikeOnTweet = async (tweetId) => {
  try {
    if (!tweetId) {
      return console.log("Tweet id is required to toggle like");
    }

    const res = await api.post(`/like/toggle-tweet-like/${tweetId}`);

    if (res.status !== 200) {
      return console.log("Error while toggle like on tweet");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getLikesOnVideo = async (videoId) => {
  try {
    if (!videoId) {
      return console.log("Video id is required to fetch video likes");
    }

    const res = await api.get(`/like/video-likes/${videoId}`);

    if (res.status !== 200) {
      return console.log("Errror while fetching video likes");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getLikedVideos = async () => {
  try {
    const res = await api.get(`/like/liked-videos`);

    if (res.status !== 200) {
      return console.log("Error while fetching liked videos");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getLikesOnTweet = async (tweetId) => {
  try {
    if (!tweetId) {
      return console.log("Tweet id is required to fetch tweet likes");
    }

    const res = await api.get(`/like/tweet-likes/${tweetId}`);

    if (res.status !== 200) {
      return console.log("Errror while fetching tweet likes");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

export {
  toggleLikeOnVideo,
  toggleLikeOnComment,
  toggleLikeOnTweet,
  getLikesOnVideo,
  getLikedVideos,
  getLikesOnTweet,
};
