import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard.jsx";
import { getWatchHistory } from "../services/user/profile.api.js";
import errorToast from "../utils/notification/error.js";
import formatDuration from "../utils/functions/videoDurationFormat.js";
import groupWatchHistoryByDate  from "../utils/functions/groupWatchHistoryByDate.js";

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserWatchHistory = async () => {
      setLoading(true);
      const res = await getWatchHistory();

      if (res.statuscode !== 200) {
        setLoading(false);
        errorToast("Failed to get your watch history. Please Try again");
        return;
      }

      setWatchHistory(res.data);
      setLoading(false);
    };

    fetchUserWatchHistory();
  }, []);

  const groupedHistory = groupWatchHistoryByDate(watchHistory);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Watch History</h1>

        {loading ? (
          <p className="text-muted">Loading...</p>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <p className="text-muted">No history available.</p>
        ) : (
          Object.entries(groupedHistory).map(([label, videos]) => (
            <div key={label} className="mb-10">
              <h2 className="text-xl font-semibold mb-4">{label}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((eachData) => (
                  <VideoCard
                    key={eachData?.video?._id}
                    videoId={eachData?.video?._id}
                    thumbnail={eachData?.video?.thumbnail}
                    title={eachData?.video?.title}
                    fullname={eachData?.video?.owner?.fullname}
                    username={eachData?.video?.owner?.username}
                    avatar={eachData?.video?.owner?.avatar}
                    views={eachData?.video?.views}
                    timestamp={eachData?.video?.createdAt}
                    duration={formatDuration(eachData?.video?.duration)}
                    hoverToPlay={false}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WatchHistory;
