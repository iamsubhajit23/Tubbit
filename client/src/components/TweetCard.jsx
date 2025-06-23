import { useState } from "react";
import {
  Heart,
  MessageCircle,
  Repeat,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/Avatar.jsx";
import { Card } from "./ui/Card.jsx";
import { Button } from "./ui/Button.jsx";

const TweetCard = ({
  tweetId,
  content,
  username,
  fullname,
  userAvatar,
  timestamp,
  likes = 0,
  retweets = 0,
  replies = 0,
  images = [],
}) => {
  const imageList = images ? (Array.isArray(images) ? images : [images]) : [];
  const [isLiked, setIsLiked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [retweetCount, setRetweetCount] = useState(retweets);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  const handleMouseClick = () => {
    if (authStatus) {
      navigate(`/tweet/${tweetId}`)
    }else{
      navigate("/auth")
    }
  }    

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRetweet = () => {
    setIsRetweeted((prev) => !prev);
    setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
  };

  return (
    <Card className="p-4 border-0 border-b border-border rounded-none hover:bg-card/80 transition-colors cursor-pointer">
      <div className="flex gap-3" onClick={handleMouseClick}>
        <Avatar className="w-10 h-10">
          <AvatarImage src={userAvatar} alt={username} />
          <AvatarFallback>{fullname?.slice(0,1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold hover:underline cursor-pointer">
              {fullname}
            </span>
            <span className="text-muted-foreground">
              @{username?.toLowerCase().replace(/\s+/g, "")}
            </span>
            <span className="text-muted-foreground">•</span>
            <span className="text-muted-foreground text-sm">{timestamp}</span>

            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <p className="text-foreground mb-3 whitespace-pre-wrap">{content}</p>

          {/* Images */}
          {imageList.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden">
              {imageList.length === 1 ? (
                <img
                  src={imageList[0]}
                  alt="Post image"
                  className="w-full max-h-96 object-cover rounded-2xl"
                />
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  {imageList.slice(0, 4).map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-48 object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between max-w-md text-muted-foreground">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{replies}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRetweet}
              className={`flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 ${
                isRetweeted ? "text-green-500" : ""
              }`}
            >
              <Repeat className="h-4 w-4" />
              <span className="text-sm">{retweetCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10 ${
                isLiked ? "text-red-500" : ""
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm">{likeCount}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TweetCard;
