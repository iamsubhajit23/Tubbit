import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import { TooltipProvider } from "./components/ui/ToolTip.jsx";
import App from "./App.jsx";

import SearchPage from "./pages/SearchPage.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import CreateTweet from "./pages/CreateTweet.jsx";
import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Profile from "./pages/Profile.jsx";
import Tweets from "./pages/Tweets.jsx";
import Tweet from "./pages/Tweet.jsx";
import Auth from "./pages/Auth.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import WatchHistory from "./pages/WatchHistory.jsx";
import LikedVideos from "./pages/LikedVideos.jsx";
import Playlists from "./pages/Playlists.jsx";
import Playlist from "./pages/Playlist.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

import store from "./store/Store.js";

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
                <Route path="/auth/" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/*" element={<App />}>
                  <Route path="" element={<Home />} />
                  <Route path="search/" element={<SearchPage />} />
                  <Route path="upload-video" element={<UploadVideo />} />
                  <Route path="create-tweet" element={<CreateTweet />} />
                  <Route path="watch/:videoId" element={<Watch />} />
                  <Route path="profile/:username" element={<Profile />} />
                  <Route path="tweets" element={<Tweets />} />
                  <Route path="tweet/:tweetId" element={<Tweet />} />
                  <Route path="watch-history" element={<WatchHistory />} />
                  <Route path="liked-videos" element={<LikedVideos />} />
                  <Route path="playlists" element={<Playlists />} />
                  <Route path="playlist/:playlistId" element={<Playlist />} />
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
