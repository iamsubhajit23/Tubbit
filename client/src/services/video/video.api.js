import api from "../api.js";
import successToast from "../../utils/notification/success";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

const uploadVideo = async (data) => {
  try {
    if (!data.title || !data.description) {
      return apiErrorHandler(null, "Title and description both required");
    }

    if (!data.videofile) {
      return apiErrorHandler(null, "Video file is required");
    }

    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("videofile", data.videofile);
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    const res = await api.post("/video/upload-video", formData);

    if (res.status !== 200) {
      return apiErrorHandler(null, "Video uploading failed. Please try again");
    }

    successToast("Video uploaded successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Video uploading failed");
  }
};

const deleteVideo = async (videoId) => {
  try {
    if (!videoId) {
      return apiErrorHandler();
    }
    const res = await api.delete(`/video/id/${videoId}`);

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to delete video. Try again");
    }

    successToast("Video deleted successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to delete video");
  }
};

const updateThumbnail = async (data) => {
  try {
    if (!data.videoId) {
      return apiErrorHandler(null, "Not found any video with this id");
    }
    if (!data.thumbnail) {
      return apiErrorHandler(null, "Thumbnail is required");
    }

    const formData = new FormData();
    formData.append("thumbnail", data.thumbnail);

    const res = await api.patch(`/video/${data.videoId}/thumbnail`, formData);

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to update thumbnail. Try again");
    }

    successToast(`Thumbnail updated successfully for ${res.data.title}`);
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to update thumbnail");
  }
};

const updateVideoInfo = async (data) => {
  try {
    const { videoId, title, description } = data;
    if (!videoId) {
      return apiErrorHandler(null, "Not found any video with this id");
    }
    if (!title && !description) {
      return apiErrorHandler(null, "Title or description is required");
    }

    const res = await api.patch(`/video/id/${videoId}`, { title, description });

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to update video info. Try again");
    }

    successToast("Video info updated successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to update video info");
  }
};

const togglePublishStatus = async (videoId) => {
  try {
    if (!videoId) {
      return apiErrorHandler(null, "Not found any video with this id");
    }
    const res = await api.patch(`/video/${videoId}/publish-status`);
    
    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to toggle publish status");
    }
    successToast("Publish status toggled successfully");

    return res.data;
  } catch (error) {
    return apiErrorHandler(error);
  }
};

const getAllVideos = async (filters) => {
  try {
    const res = await api.get("/video/", {
      params: {
        query: filters.query || "",
        sortBy: filters.sortBy || "createdAt",
        sortType: filters.sortType || "desc",
        userId: filters.userId || "",
      },
    });

    if (res.status !== 200) {
      return apiErrorHandler(null, "Failed to fetch videos. Try again");
    }

    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to fetch videos");
  }
};

const getVideoById = async (videoId) => {
  try {
    const res = await api.get(`/video/id/${videoId}`);

    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to fetch video");
  }
};

export {
  uploadVideo,
  deleteVideo,
  updateThumbnail,
  updateVideoInfo,
  togglePublishStatus,
  getAllVideos,
  getVideoById,
};
