import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import CreateTweet from "./pages/CreateTweet.jsx";
import { TooltipProvider } from "./components/ui/ToolTip.jsx";
import store from "./store/store.js";
import App from "./App.jsx";

import Home from "./pages/Home.jsx";
import Watch from "./pages/Watch.jsx";
import Profile from "./pages/Profile.jsx";
import Tweets from "./pages/Tweets.jsx";
import Tweet from "./pages/Tweet.jsx";
import Auth from "./pages/Auth.jsx";
import Settings from "./pages/Settings.jsx";
import NotFound from "./pages/NotFound.jsx";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Provider store={store}>
          <TooltipProvider>
            {/* <Toaster />
          <Sonner /> */}
            <ToastContainer />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route element={<App />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/upload-video" element={<UploadVideo />} />
                  <Route path="/create-tweet" element={<CreateTweet />} />
                  <Route path="/watch/:videoId" element={<Watch />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/tweets" element={<Tweets />} />
                  <Route path="/tweet/:id" element={<Tweet />} />
                  <Route path="/settings" element={<Settings />} />
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
