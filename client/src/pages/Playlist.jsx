import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Play, Shuffle, Share, MoreVertical, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Card } from "../components/ui/Card.jsx";
import { getPlaylistById } from "../services/playlist/playlist.api.js";
import errorToast from "../utils/notification/error.js";
import formatDuration from "../utils/functions/videoDurationFormat.js";

const Playlist = () => {
  const { playlistId } = useParams();
  const [loading, setLoading] = useState(false);
  const [playlistData, setPlaylistData] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [playlistThumbnail, setPlaylistThumbnail] = useState("");
  const [totalDuration, setTotalDuration] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaylist = async () => {
      setLoading(true);
      const res = await getPlaylistById(playlistId);

      if (res.statuscode !== 200) {
        errorToast("Can't get this playlist right now. Please try again.");
        setLoading(false);
        return;
      }

      setPlaylistData(res.data?.playlist);
      setPlaylistVideos(res.data?.playlist?.videos);
      setLoading(false);
    };

    fetchPlaylist();
  }, [playlistId]);

  useEffect(() => {
    const getplaylistThumbnail = () => {
      const thumbnail =
        playlistVideos?.[0]?.thumbnail || playlistData?.thumbnail;

      setPlaylistThumbnail(thumbnail);
      console.log(playlistVideos?.[0]);
    };

    const calculateTotalDuration = () => {
      const total = playlistVideos.reduce((acc, video) => {
        return acc + (video?.duration || 0);
      }, 0);

      setTotalDuration(formatDuration(total));
    };
    getplaylistThumbnail();
    calculateTotalDuration();
  }, [playlistVideos, playlistData]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Playlist Info */}
          <div className="lg:col-span-1 order-1 lg:order-1">
            <Card className="sticky top-6">
              <div className="relative">
                <img
                  src={playlistThumbnail}
                  alt={playlistData?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-t-lg">
                  <div className="text-center text-white">
                    <Play className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm font-medium">Play all</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h1 className="text-xl font-bold mb-4">{playlistData?.name}</h1>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="w-10 h-10">
                    <AvatarImage
                      src={playlistData?.owner?.avatar}
                      alt={playlistData?.owner?.fullname}
                    />
                    <AvatarFallback>
                      {playlistData?.owner?.fullname?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium hover:text-primary cursor-pointer transition-colors">
                      {playlistData?.owner?.fullname}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-4 space-y-1">
                  <div className="flex items-center gap-2">
                    <p>
                      {playlistVideos?.length} videos{" "}
                      <span className="ml-1">•</span>
                    </p>
                    <p className="flex items-center gap-1">~ {totalDuration}</p>
                  </div>
                  {playlistData?.updatedAt ? (
                    <p>
                      Updated{" "}
                      {formatDistanceToNow(new Date(playlistData?.updatedAt), {
                        addSuffix: true,
                      })}
                    </p>
                  ) : (
                    <p>Updated recently</p>
                  )}
                </div>

                <div className="mb-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {playlistData?.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button className="flex-1 min-w-[120px]" size="lg">
                    <Play className="w-4 h-4 mr-2" />
                    Play all
                  </Button>

                  <Button variant="outline" className="flex-1 min-w-[120px]">
                    <Shuffle className="w-4 h-4 mr-2" />
                    Shuffle
                  </Button>

                  <Button variant="outline" className="flex-1 min-w-[120px]">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>

                  <Button variant="outline" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Right - Video List */}
          <div className="lg:col-span-2 order-2 lg:order-2">
            <div className="space-y-4 max-h-[calc(100vh-3rem)] overflow-y-auto pr-2">
              {playlistVideos.map((video, index) => (
                <Card
                  key={video._id}
                  className="p-4 hover:bg-accent/50 transition-colors "
                >
                  <div className="flex gap-4">
                    <div className="flex items-center justify-center w-8 text-sm text-muted-foreground font-medium">
                      {index + 1}
                    </div>

                    <div
                      onClick={() => navigate(`/watch/${video?._id}`)}
                      className="relative flex-shrink-0 cursor-pointer"
                    >
                      <img
                        src={video?.thumbnail}
                        alt={video?.title}
                        className="w-40 h-24 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                        <Play className="w-8 h-8 text-white" />
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {formatDuration(video?.duration)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
                        {video?.title}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <p
                          onClick={() =>
                            navigate(`/profile/${video?.owner?.username}`)
                          }
                          className="cursor-pointer hover:text-white"
                        >
                          {video?.owner?.fullname}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {video?.views} views •{" "}
                        {video?.createdAt
                          ? formatDistanceToNow(new Date(video.createdAt), {
                              addSuffix: true,
                            })
                          : "some time ago"}
                      </p>
                    </div>

                    <div className="flex items-start">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
