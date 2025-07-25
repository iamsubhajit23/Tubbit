import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/Button.jsx";

const VideoPlayer = ({ src }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;

    if (!document.fullscreenElement) {
      await container.requestFullscreen();

      if (window.innerWidth <= 768) {
        container.classList.add("rotate-landscape");
      }
      setIsFullScreen(true);
    } else {
      await document.exitFullscreen();
      container.classList.remove("rotate-landscape");
      setIsFullScreen(false);
    }
  };

  const handleVolume = (e) => {
    const value = parseFloat(e.target.value);
    videoRef.current.volume = value;
    setVolume(value);
    setIsMuted(value === 0);
  };

  const handleSeek = (e) => {
    const value = parseFloat(e.target.value);
    videoRef.current.currentTime = value;
    setCurrentTime(value);
  };

  const handlePlaybackSpeed = (e) => {
    const rate = parseFloat(e.target.value);
    setPlaybackRate(rate);
  };

  useEffect(() => {
    const video = videoRef.current;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
      const value = (video.currentTime / video.duration) * 100;
      setProgress(isNaN(value) ? 0 : value);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("waiting", () => setIsLoading(true));
    video.addEventListener("playing", () => setIsLoading(false));

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  useEffect(() => {
    if (!showControls) return;
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [showControls]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const container = containerRef.current;
      if (!document.fullscreenElement && container) {
        container.classList.remove("rotate-landscape");
        setIsFullScreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-video rounded-xl overflow-hidden group bg-black"
      onMouseMove={() => setShowControls(true)}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full"
        muted={isMuted}
        onClick={togglePlay}
        controls={false}
        autoPlay
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <Loader2 className="animate-spin w-8 h-8 text-white" />
        </div>
      )}

      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 space-y-2 text-white">
          {/* Progress Bar */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full appearance-none h-1 rounded bg-gray-300"
          />

          {/* Time display */}
          <div className="flex justify-between text-xs text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={togglePlay}>
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>

              <Button variant="ghost" onClick={toggleMute}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </Button>

              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolume}
                className="w-24 h-1"
              />

              <select
                value={playbackRate}
                onChange={handlePlaybackSpeed}
                className="bg-transparent text-sm px-1 outline-none"
              >
                {[0.5, 1, 1.25, 1.5, 2].map((rate) => (
                  <option key={rate} value={rate} className="text-black">
                    {rate}x
                  </option>
                ))}
              </select>
            </div>

            <Button variant="ghost" onClick={toggleFullscreen}>
              {isFullScreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
