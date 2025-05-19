import api from "../api.js";

const getChannelInsights = async () => {
  try {
    const res = await api.get("/dashboard/stats");

    if (res.status !== 200) {
      return console.log("SERVICES :: ERROR: Failed to fetch channel insights");
    }

    return res.data;
  } catch (error) {
    return console.error(error?.response?.data?.message);
  }
};

export { getChannelInsights };
