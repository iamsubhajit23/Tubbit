import "./index.css";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Navbar } from "./components/header/Navbar.jsx";
import { getCurrentUser } from "./services/user/profile.api.js";
import { login, logout } from "./store/slices/AuthSlice.js";
import { getSubscribedChannel } from "./services/subscription/subscription.api.js";
import { setSubscribedChannels } from "./store/slices/subscriptionSlice.js";
import { getLikedVideos } from "./services/like/like.api.js";
import { setLikedVideos } from "./store/slices/likeSlice.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      const response = await getCurrentUser();
      if ([200, 201].includes(response.statuscode)) {
        dispatch(login({ userData: response }));
      } else {
        dispatch(logout());
      }
    };

    const fetchSubscriptions = async () => {
      const res = await getSubscribedChannel();
      if (res.statuscode === 200) {
        const ids = res.data.subscribedChannel.map((ch) => ch.channel._id);
        dispatch(setSubscribedChannels(ids));
      }
    };

    const fetchLikedVideos = async () => {
      const res = await getLikedVideos();
      if (res.statuscode === 200) {
        const ids = res.data.likedVideos.map((v) => v._id);
        dispatch(setLikedVideos(ids));
      }
    };

    checkAuth();
    fetchSubscriptions();
    fetchLikedVideos();
  }, []);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};
export default App;
