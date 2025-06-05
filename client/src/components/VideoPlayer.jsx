import { useRef, useState, useEffect } from "react";
//import { Slider } from "./ui/Slider"; // Optional
import { Button } from "./ui/Button";

export default function VideoPlayer({ src, poster }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

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

  const handleSeek = (e) => {
    const video = videoRef.current;
    video.currentTime = e.target.value;
    setCurrentTime(video.currentTime);
  };

  const handleVolume = (e) => {
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
  };

  const formatTime = (time) =>
    `${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, "0")}`;

  useEffect(() => {
    const video = videoRef.current;
    const setMeta = () => setDuration(video.duration);
    const updateTime = () => setCurrentTime(video.currentTime);

    video.addEventListener("loadedmetadata", setMeta);
    video.addEventListener("timeupdate", updateTime);

    return () => {
      video.removeEventListener("loadedmetadata", setMeta);
      video.removeEventListener("timeupdate", updateTime);
    };
  }, []);

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        playsInline
      />

      {/* Overlay Controls */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 via-black/30 to-transparent px-4 py-3 space-y-2 text-white">
        {/* Seek Bar */}
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleSeek}
          step="0.1"
          className="w-full accent-red-500 cursor-pointer"
        />

        {/* Control Row */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlay}
              className="text-white p-1"
            >
              {isPlaying ? "⏸" : "▶️"}
            </Button>
            <span>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="w-24 accent-green-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
