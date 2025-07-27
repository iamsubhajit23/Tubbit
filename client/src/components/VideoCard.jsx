import React, { useEffect, useRef, useState } from "react";
import {
  Volume2,
  VolumeX,
  MoreVertical,
  Bookmark,
  X,
  Flag,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar.jsx";
import { Card } from "./ui/Card.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./ui/DropDownMenu.jsx";
import { Button } from "./ui/Button.jsx";
import { deleteVideo, getVideoById } from "../services/video/video.api.js";

const VideoCard = ({
  videoId,
  thumbnail,
  videoUrl,
  title,
  fullname,
  username,
  avatar,
  views,
  timestamp,
  duration,
  hoverToPlay = true,
}) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [videoOwnerId, setVideoOwnerId] = useState(null);
  const [isVideoDeleting, setIsVideoDeleting] = useState(false);

  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);
  const authUserData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    const fetchVideoOwnerId = async () => {
      const res = await getVideoById(videoId);
      if (res?.statuscode === 200) {
        setVideoOwnerId(res?.data?.owner?._id);
      } else {
        return;
      }
    };
    fetchVideoOwnerId();
  }, [videoId]);

  const isOwner = authUserData?.data?._id === videoOwnerId;

  const handleVideoDeleting = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );
    if (!confirmed) return;

    setIsVideoDeleting(true);
    const res = await deleteVideo(videoId);

    if (res?.statuscode === 200) {
      successToast("Video deleted successfully");
      window.location.reload();
    } else {
      errorToast("Failed to delete video");
    }
    setIsVideoDeleting(false);
  }

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleMouseClick = () => {
    navigate(`/watch/${videoId}`);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 bg-card/50 hover:bg-card transition-all duration-300">
      {/* video or thumbnail */}
      <div
        className="relative aspect-video overflow-hidden rounded-t-lg"
        onMouseEnter={hoverToPlay ? handleMouseEnter : undefined}
        onMouseLeave={hoverToPlay ? handleMouseLeave : undefined}
        onClick={handleMouseClick}
      >
        {isHovered ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMuted((prev) => !prev);
              }}
              className="absolute top-2 right-2 z-10 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </button>

            <video
              ref={videoRef}
              src={videoUrl}
              playsInline
              onTimeUpdate={handleTimeUpdate}
              muted={isMuted}
              className="w-full h-full object-cover transition-transform duration-300"
            />
          </>
        ) : (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300"
          />
        )}

        {/* display duration*/}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
          {isHovered ? `${formatTime(currentTime)} / ${duration}` : duration}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex gap-3 mt-4">
        <Avatar
          onClick={() => {
            authStatus ? navigate(`/profile/${username}`) : navigate("/auth");
          }}
          className="mt-1 flex-shrink-0 w-8 h-8"
        >
          <AvatarImage src={avatar} alt={fullname} />
          <AvatarFallback className="text-xs">
            {fullname?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium line-clamp-2 text-sm mb-1 group-hover:text-tubbit-primary transition-colors pr-6">
            {title}
          </h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p
              onClick={() => navigate(`/profile/${username}`)}
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              {fullname}
            </p>
            <p>
              {views} •{" "}
              {timestamp &&
                formatDistanceToNow(new Date(timestamp), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* More menu top-right aligned */}
        {authStatus && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 absolute top-0 right-0 text-muted-foreground hover:bg-[#020816] hover:text-foreground"
              >
                <MoreVertical className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="bottom" align="end">
              <DropdownMenuItem onClick={() => alert("Save to playlist")}>
                <Bookmark className="w-4 h-4 mr-2" /> Save to playlist
              </DropdownMenuItem>
              {isOwner ? (
                <DropdownMenuItem onClick={handleVideoDeleting}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Video
                </DropdownMenuItem>
              ) : (
                <>
                  <DropdownMenuItem onClick={() => alert("Not interested")}>
                    <X className="w-4 h-4 mr-2" /> Not interested
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => alert("Report video")}>
                    <Flag className="w-4 h-4 mr-2" /> Report
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </Card>
  );
};

export default VideoCard;
