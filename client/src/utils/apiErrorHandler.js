import errorToast from "./notification/error.js";

const apiErrorHandler = (error, defaultMessage = "Something went wrong") => {
  console.error("API Error: ", error);

  const message =
    error?.response?.data?.message || error?.message || defaultMessage;

  errorToast(message);

  return {
    error: true,
    message,
  };
};

export { apiErrorHandler };
