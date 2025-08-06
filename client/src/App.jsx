import {Analytics} from "@vercel/analytics/react"
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./index.css";
import { SidebarProvider } from "./components/ui/Sidebar.jsx";
import AppSidebar from "./components/AppSidebar.jsx";
import { Navbar } from "./components/header/Navbar.jsx";
import { getCurrentUser } from "./services/user/profile.api.js";
import { login, logout } from "./store/slices/AuthSlice.js";
import { getSubscribedChannel } from "./services/subscription/subscription.api.js";
import { setSubscribedChannels } from "./store/slices/subscriptionSlice.js";
import { getLikedVideos } from "./services/like/like.api.js";
import { setLikedVideos } from "./store/slices/likeSlice.js";
import store from "./store/Store.js";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      if (store.getState().auth.userData) return;
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
      <Analytics />
    </SidebarProvider>
  );
};

export default App;
