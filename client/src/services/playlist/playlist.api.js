import api from "../api.js";
import successToast from "../../utils/notification/success";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

const createPlaylist = async (name, description) => {
  try {
    if (!name) {
      return apiErrorHandler(null, "Please enter playlist name");
    }

    const res = await api.post("/playlist/create/", { name, description });

    if (![200, 201].includes(res.status)) {
      return console.log("Failed to create playlist");
    }

    successToast("Playlist created successfully");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const addVideoToPlaylist = async (playlistId, videoId) => {
  try {
    if (!playlistId || !videoId) {
      return console.log(
        "SERVICES :: ERROR:  PlaylistId and videoId both required"
      );
    }

    const res = await api.post(`/playlist/add-video/${playlistId}/${videoId}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to add video on playlist");
    }

    successToast("Video is added");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const removeVideoFromPlaylist = async (playlistId, videoId) => {
  try {
    if (!playlistId || !videoId) {
      return console.log(
        "SERVICES :: ERROR: Playlist id and video id both are required"
      );
    }

    const res = await api.patch(
      `/playlist/remove-video/${playlistId}/${videoId}`
    );

    if (res.status !== 200) {
      return console.log(
        "SERVICES :: ERROR: Failed to remove video from playlist"
      );
    }

    successToast("Video is removed");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const updatePlaylistInfo = async (playlistId, name, description) => {
  try {
    if (!name && !description) {
      return apiErrorHandler(null, "Name or description is required");
    }

    if (!playlistId) {
      return console.log(
        "SERVICES :: ERROR: Playlist id is required to update playlist info"
      );
    }

    const res = await api.patch(`/playlist/update-playlist/${playlistId}`, {
      name,
      description,
    });

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to update playlist info");
    }

    successToast("Playlist updated successfully");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const getPlaylistById = async (playlistId) => {
  try {
    if (!playlistId) {
      return console.log(
        "SERVICES :: ERROR: Playlist id is required to get playlist"
      );
    }

    const res = await api.get(`/playlist/${playlistId}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to fetch playlist");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response.data?.message);
  }
};

const getUserPlaylists = async () => {
  try {
    const res = await api.get("/playlist/");

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to fetch user playlists");
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const togglePublishStatus = async (playlistId) => {
  try {
    if (!playlistId) {
      return console.log(
        "SERVICES :: ERROR: Playlistid is required to toggle publish status "
      );
    }

    const res = await api.patch(`/playlist/toggle-status/${playlistId}`);

    if (res.status !== 200) {
      return console.log(
        "SERVICES :: ERROR: Failed to toggle playlist publish status"
      );
    }

    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

const deletePlaylist = async (playlistId) => {
  try {
    if (!playlistId) {
      return console.log(
        "SERVICES :: ERROR: Playlistid is required to delete playlist"
      );
    }

    const res = await api.delete(`playlist/delete-playlist/${playlistId}`);

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to delete playlist");
    }

    successToast("Playlist has been deleted successfully");
    return res.data;
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};


export {
    createPlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    updatePlaylistInfo,
    getPlaylistById,
    getUserPlaylists,
    togglePublishStatus,
    deletePlaylist
}