import api from "../api";
import successToast from "../../utils/notification/success";
import errorToast from "../../utils/notification/error";
import { apiErrorHandler } from "../../utils/apiErrorHandler";

const changePassword = async (credentials) => {
  try {
    const { oldPassword, newPassword } = credentials;

    if (!oldPassword || !newPassword) {
      return apiErrorHandler(null, "Missing required field");
    }

    if (oldPassword === newPassword) {
      return apiErrorHandler(
        null,
        "New password must be different from current one"
      );
    }

    const res = await api.post("/user/change-password", {
      oldPassword,
      newPassword,
    });

    if (res.status !== 200) {
      return apiErrorHandler(
        null,
        "Failed to change password. Please try again"
      );
    }

    successToast("Password change successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to change password");
  }
};

const updateUserDetails = async (credentials) => {
  try {
    const { fullname, email } = credentials;

    if (!fullname && !email) {
      return apiErrorHandler(null, "Fullname or email is required");
    }

    const res = await api.patch("/user/update-account", {
      fullname,
      email,
    });

    if (res.status !== 200) {
      errorToast("Failed to update your details. Please try again");
      return;
    }

    successToast("Your details updated successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Faild to update your details");
  }
};

const updateAvatar = async (avatar) => {
  try {
    if (!avatar) {
      return apiErrorHandler(null, "Avatar is required");
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    const res = await api.patch("/user/update-avatar", formData);

    if (res.status !== 200) {
      return apiErrorHandler(
        null,
        "Failed to update your avatar. Please try again"
      );
    }

    successToast("Your avatar updated successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to update your avatar");
  }
};

const updateCoverImage = async (coverimage) => {
  try {
    if (!coverimage) {
      return apiErrorHandler(null, "Cover image is required");
    }

    const formData = new FormData();
    formData.append("coverimage", coverimage);

    const res = await api.put("/user/update-cover", formData);

    if (res.status !== 200) {
      return apiErrorHandler(
        null,
        "Failed to update your cover image. Please try again"
      );
    }

    successToast("Your cover image updated successfully");
    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Failed to update your cover image");
  }
};

const getCurrentUser = async () => {
  try {
    const res = await api.get("/user/current-user");
    return res.data;
  } catch (error) {
    return;
  }
};

const getChannelProfile = async (params) => {
  try {
    if (!params?.username) {
      return apiErrorHandler(null, "Username is required to get profile");
    }

    const res = await api.get(`/user/channel/${params.username}`);

    return res.data;
  } catch (error) {
    return apiErrorHandler(error, "Profile not found");
  }
};

const getWatchHistory = async () => {
    try {
        const res =  await api.get("/user/watchhistory")

        return res.data
    } catch (error) {
        return apiErrorHandler(error, "You haven't watched any video yet")
    }
}

const refreshAccessToken = async () => {
  try {
    return await api.post("/user/refresh-token");
  } catch (error) {
    return apiErrorHandler(error);
  }
};

export {
  changePassword,
  updateUserDetails,
  updateAvatar,
  updateCoverImage,
  getCurrentUser,
  getChannelProfile,
  refreshAccessToken,
  getWatchHistory
};
