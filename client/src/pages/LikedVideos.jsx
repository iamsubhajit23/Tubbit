import React, { useEffect, useState } from "react";
import VideoCard from "../components/VideoCard.jsx";
import { getLikedVideos } from "../services/like/like.api.js";
import formatDuration from "../utils/functions/videoDurationFormat.js"

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      setLoading(true);
      const res = await getLikedVideos();

      if (res.statuscode !== 200) {
        setLoading(false);
        return;
      }
      setLikedVideos(res.data?.likedVideos);
      setLoading(false);
    };
    fetchLikedVideos();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Liked Videos</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {likedVideos.map((data) => (
            <VideoCard
              key={data?._id}
              videoId={data?.video?._id}
              thumbnail={data?.video?.thumbnail}
              title={data?.video?.title}
              fullname={data?.video?.owner?.fullname}
              username={data?.video?.owner?.username}
              avatar={data?.video?.owner?.avatar}
              views={data?.video?.views}
              timestamp={data?.video?.createdAt}
              duration={formatDuration(data?.video?.duration)}
              hoverToPlay={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LikedVideos;
