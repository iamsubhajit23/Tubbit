import { useEffect, useState } from "react";
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
import errorToast from "../utils/notification/error.js";
import {
  getLikesOnTweet,
  toggleLikeOnTweet,
} from "../services/like/like.api.js";
import { getTweetComments } from "../services/comment/comment.api.js";

const TweetCard = ({
  tweetId,
  content,
  username,
  fullname,
  userAvatar,
  timestamp,
  images = [],
}) => {
  const imageList = images ? (Array.isArray(images) ? images : [images]) : [];
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [repliesCount, setRepliesCount] = useState(0);
  const navigate = useNavigate();
  const authStatus = useSelector((state) => state.auth.status);

  useEffect(() => {
    const fetchTweetLikes = async () => {
      const res = await getLikesOnTweet(tweetId);

      if (res.statuscode !== 200) {
        console.log("Failed to fetch tweet likes");
        return;
      }

      setLikeCount(res.data?.totalLikes);
    };

    const fetchTweetComments = async () => {
      const res = await getTweetComments(tweetId);

      if (res.statuscode !== 200) {
        console.log("Failed to fetch tweet comments right now");
        return;
      }
      setRepliesCount(res.data.totalDocs);
    };
    fetchTweetLikes();
    fetchTweetComments();
  }, [tweetId]);

  const handleMouseClick = () => {
    if (authStatus) {
      navigate(`/tweet/${tweetId}`);
    } else {
      errorToast("Sign in to see tweet");
      navigate("/auth");
    }
  };

  const handleLike = async () => {
    if (!tweetId) {
      return console.log("Tweet id is required to like");
    }

    const res = await toggleLikeOnTweet(tweetId);
    if (res.statuscode !== 200) {
      errorToast("Can't handle this right now");
      return;
    }
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  return (
    <Card className="p-4 border-0 border-b border-border rounded-none hover:bg-card/80 transition-colors">
      <div className="flex gap-3">
        <Avatar
          onClick={() => {
                authStatus
                  ? navigate(`/profile/${username}`)
                  : navigate("/auth");
              }}
          className="w-10 h-10 cursor-pointer"
        >
          <AvatarImage src={userAvatar} alt={username} />
          <AvatarFallback>{fullname?.slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span
              onClick={() => {
                authStatus
                  ? navigate(`/profile/${username}`)
                  : navigate("/auth");
              }}
              className="font-semibold hover:underline cursor-pointer"
            >
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
          <p
            onClick={handleMouseClick}
            className="text-foreground mb-3 whitespace-pre-wrap cursor-pointer"
          >
            {content}
          </p>

          {/* Images */}
          {imageList.length > 0 && (
            <div className="mb-3 rounded-2xl overflow-hidden">
              {imageList.length === 1 ? (
                <img
                  src={imageList[0]}
                  alt="Post image"
                  onClick={handleMouseClick}
                  className="w-full max-h-96 object-cover rounded-2xl cursor-pointer"
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
              onClick={() => navigate(`/tweet/${tweetId}`)}
              className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm">{repliesCount}</span>
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
