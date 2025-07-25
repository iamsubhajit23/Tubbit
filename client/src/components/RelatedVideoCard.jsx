import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar.jsx";

const RelatedVideoCard = ({
  videoId,
  thumbnail,
  title,
  owner,
  views,
  timestamp,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex space-x-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-all"
    >
      <img
        src={thumbnail}
        alt={title}
        className="w-36 h-20 object-cover rounded-md"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium line-clamp-2">{title}</h4>
        <p className="text-xs text-muted-foreground">{owner?.fullname}</p>
        <p className="text-xs text-muted-foreground">
          {views} views • {timestamp}
        </p>
      </div>
    </div>
  );
};

export default RelatedVideoCard;
