import api from "../api.js";

const healthcheck = async () => {
  try {
    await api.get("/healthcheck/");
  } catch (error) {
    return console.log(error?.response?.data?.message);
  }
};

export { healthcheck };
