import React, { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar.jsx";
import { Card } from "./ui/Card.jsx";

const VideoCard = ({
  videoId,
  thumbnail,
  videoUrl,
  title,
  fullname,
  avatar,
  views,
  timestamp,
  duration,
}) => {
  const videoRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const navigate = useNavigate();

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
    if (videoRef.current) {
      navigate(`/watch/${videoId}`);
    }
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

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="group cursor-pointer overflow-hidden border-0 bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover-scale">
      {/* video or thumbnail */}
      <div
        className="relative aspect-video overflow-hidden rounded-t-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
      <div className="p-4">
        <div className="flex gap-3">
          <Avatar className="mt-1 flex-shrink-0 w-8 h-8">
            <AvatarImage src={avatar} alt={fullname} />
            <AvatarFallback className="text-xs">
              {getInitials(fullname)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium line-clamp-2 text-sm mb-1 group-hover:text-tubbit-primary transition-colors">
              {title}
            </h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="hover:text-foreground transition-colors cursor-pointer">
                {fullname}
              </p>
              <p>
                {views} • {timestamp}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VideoCard;
