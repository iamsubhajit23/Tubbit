import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import { TooltipProvider } from "./components/ui/ToolTip.jsx";
import MainLayout from "./components/MainLayout.jsx";

import UploadVideo from "./pages/UploadVideo.jsx";
import CreateTweet from "./pages/CreateTweet.jsx";
import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Profile from "./pages/Profile.jsx";
import Tweets from "./pages/Tweets.jsx";
import Tweet from "./pages/Tweet.jsx";
import Auth from "./pages/Auth.jsx";
import History from "./pages/History.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Playlists from "./pages/Playlists.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

import store from "./store/store.js";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <TooltipProvider>
            <ToastContainer />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/*" element={<MainLayout />}>
                  <Route path="" element={<Home />} />
                  <Route path="upload-video" element={<UploadVideo />} />
                  <Route path="create-tweet" element={<CreateTweet />} />
                  <Route path="watch/:videoId" element={<Watch />} />
                  <Route path="profile/:username" element={<Profile />} />
                  <Route path="tweets" element={<Tweets />} />
                  <Route path="tweet/:tweetId" element={<Tweet />} />
                  <Route path="watch-history" element={<History />} />
                  <Route path="liked-videos" element={<LikedVideos />} />
                  <Route path="playlists" element={<Playlists />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </Provider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
