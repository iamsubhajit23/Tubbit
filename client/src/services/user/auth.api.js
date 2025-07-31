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

    successToast("Your account has been created successfully.");
    return res;
  } catch (error) {
    const message = error?.response?.data?.message;
    errorToast(message);
    return error?.response;
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

    return error?.response;
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
    const message = error?.response?.data?.message;
    errorToast(message);
    return;
  }
};

const sendEmailOtp = async (email) => {
  try {
    if (!email) {
      console.log("Email required to send email OTP")
      return;
    }

    const res = await api.post("/user/send-email-otp", { email });

    if (res.status !== 200) {
      return { statuscode: res.status, message: res.message };
    }
    return res.data;
  } catch (error) {
    return error?.response?.data;
  }
}

const verifyEmailOtp = async (email, otp) => {
  try {
    if (!email) {
      console.log("Email required to send email OTP")
      return;
    }

    if (!otp) {
      console.log("Please enter OTP")
      return;
    }

    const res = await api.post("/user/verify-email-otp", { email, otp });

    if (res.status !== 200) {
      return { statuscode: res.status, message: res.message };
    }
    return res.data;
  } catch (error) {
    const message = error?.response?.data?.message;
    errorToast(message);
    return error?.response?.data;
  }
}

const sendResetPasswordEmailOtp = async (email) => {
  try {
    if (!email) {
      console.log("Email is required")
      return;
    }

    const res = await api.post("/user/reset-password-email-otp", { email });

    return res.data;
  } catch (error) {
    return error?.response?.data;
  }
}

const resetPassword = async (email, password) => {
  try {
    if (!email) {
      console.log("Email is required");
      return;
    }

    if (!password) {
      console.log("Password is required");
      return;
    }

    const res = await api.post("/user/reset-password", {
      email,
      password,
    });

    return res.data;
  } catch (error) {
    return error?.response?.data
  }
}

export {
  signUp,
  signIn,
  signOut,
  sendEmailOtp,
  verifyEmailOtp,
  sendResetPasswordEmailOtp,
  resetPassword,
};
