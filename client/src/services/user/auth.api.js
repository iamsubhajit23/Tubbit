import api from "../api.js";
import successToast from "../../utils/notification/success.js";
import { apiErrorHandler } from "../../utils/apiErrorHandler.js";
import errorToast from "../../utils/notification/error.js";

const signUp = async (credentials) => {
  try {
    const { fullname, username, email, password } = credentials;
    if (
      [fullname, username, email, password].some(
        (field) => field?.trim() === ""
      )
    ) {
      return apiErrorHandler(null, "Missing required fields");
    }

    const res = await api.post("/user/register", {
      fullname,
      username,
      email,
      password,
    });

    if (![200, 201].includes(res.status)) {
      apiErrorHandler(null, "Signup failed. Please try again.");
    }

    successToast("Signup successfull. Please sign in, to confirm your account.");
    return res;
  } catch (error) {
    return apiErrorHandler(error, "Signup failed.");
  }
};

const signIn = async (credentials) => {
  try {
    const { username, email, password } = credentials;

    if ([username, email, password].some((field) => !field?.trim())) {
      errorToast("Missing required fields");
      return;
    }

    const res = await api.post("/user/login", {
      username,
      email,
      password,
    });

    successToast("Signin Successful");
    return res;
  } catch (error) {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 429) {
      errorToast("Too many requests. Please try again after 15 minitues.");
    } else {
      errorToast(message || "Signin failed. Please try again.");
    }

    return null;
  }
};

const signOut = async () => {
  try {
    const res = await api.post("/user/logout");

    if (res.status !== 200) {
      return apiErrorHandler(null, "Logout failed");
    }
    successToast("Logout Successfull");
    return res;
  } catch (error) {
    return apiErrorHandler(error, "Logout failed");
  }
};

export { signUp, signIn, signOut };
