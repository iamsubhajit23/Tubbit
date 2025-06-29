import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import VideoCard from "../components/VideoCard.jsx";
import SkeletonLoader from "../components/ui/SkeletonLoader.jsx";
import { getAllVideos } from "../services/video/video.api.js";
import errorToast from "../utils/notification/error.js";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const response = await getAllVideos({
        query: "",
        sortBy: "createdAt",
        sortType: "desc",
        userId: "",
      });

      if (response.statuscode !== 200) {
        errorToast("Failed to fetch videos. Please try again");
        return;
      }
      setVideos(response.data.docs);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const padded = (n) => String(n).padStart(2, "0");

    return h > 0
      ? `${padded(h)}:${padded(m)}:${padded(s)}`
      : `${padded(m)}:${padded(s)}`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <SkeletonLoader className="aspect-video" />
              <div className="flex gap-3">
                <SkeletonLoader
                  variant="circular"
                  className="w-8 h-8 flex-shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <SkeletonLoader className="h-4" />
                  <SkeletonLoader className="h-3 w-2/3" />
                  <SkeletonLoader className="h-3 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video, index) => (
          <div
            key={video._id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <VideoCard
              {...video}
              videoId={video._id}
              videoUrl={video.videofile}
              fullname={video.owner.fullname}
              username={video.owner.username}
              avatar={video.owner.avatar}
              duration={formatDuration(video.duration)}
              timestamp={video.createdAt}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
