import conf from "../confi/conf";
import axios from "axios";

const api = axios.create({
  baseURL: conf.requestUrl,
  withCredentials: true,
});

export default api;
