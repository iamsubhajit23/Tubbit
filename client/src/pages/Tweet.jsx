import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, MessageCircle, Repeat, Share, ArrowLeft } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import { Card } from "../components/ui/Card.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Textarea } from "../components/ui/TextArea";
import errorToast from "../utils/notification/error.js";
import successToast from "../utils/notification/success.js";
import { getTweetById } from "../services/tweet/tweet.api.js";
import { getTweetComments } from "../services/comment/comment.api.js";
import { toggleLikeOnTweet } from "../services/like/like.api.js";
import { addCommentOnTweet } from "../services/comment/comment.api.js";

const Tweet = () => {
  const { tweetId } = useParams();
  const [tweetData, setTweetData] = useState();
  const [replies, setReplies] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [reply, setReply] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  //   const [isRetweeted, setIsRetweeted] = useState(false);
  //   const [likeCount, setLikeCount] = useState(tweet.likes);
  //   const [retweetCount, setRetweetCount] = useState(tweet.retweets);
  const authStatus = useSelector((state) => state.auth.status);
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};

  useEffect(() => {
    const fetchTweet = async () => {
      const res = await getTweetById(tweetId);

      if (res.statuscode !== 200) {
        errorToast("Failed to fetch tweet");
        return;
      }
      setTweetData(res.data?.tweet);
    };
    fetchTweet();
  }, [tweetId]);

  useEffect(() => {
    const fetchReplies = async () => {
      const res = await getTweetComments(tweetId);

      if (res.statuscode !== 200) {
        errorToast("Failed to fetch tweet replies");
        return;
      }
      setReplies(res?.data?.comments);
    };
    fetchReplies();
  }, [tweetId, replies]);

  const getInitials = (name) => {
    if (!name) return "NA";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLike = async () => {
    const res = await toggleLikeOnTweet(tweetId);
    if (res.statuscode !== 200) {
      errorToast("Error in toggle like");
      return;
    }
    setIsLiked(!isLiked);
  };

  const handleReplySubmit = async () => {
    if (!reply.trim()) return;
    setIsPosting(true);
    const response = await addCommentOnTweet(tweetId, reply.trim());

    if (![200, 201].includes(response.statuscode)) {
      errorToast("Failed to post reply");
      return;
    } else {
      successToast("Reply posted");
      setReply("");
      setReplies((prev) => [response.data, ...prev]);
    }
    setIsPosting(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReplySubmit();
    }
  };

  //   const handleRetweet = () => {
  //     setIsRetweeted(!isRetweeted);
  //     setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
  //   };

  //   const handleComment = () => {
  //     if (newComment.trim()) {
  //       console.log("Adding comment:", newComment);
  //       setNewComment("");
  //     }
  //   };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-6 animate-fade-in">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card className="p-6 mb-6">
        <div className="flex gap-3 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={tweetData?.owner?.avatar}
              alt={tweetData?.owner?.username}
            />
            <AvatarFallback>
              {getInitials(tweetData?.owner?.fullname)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-lg">
                {tweetData?.owner?.username}
              </span>
              <span className="text-muted-foreground">
                @{tweetData?.owner?.username.toLowerCase().replace(" ", "")}
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {tweetData?.createdAt && !isNaN(new Date(tweetData.createdAt))
                ? formatDistanceToNow(new Date(tweetData.createdAt), {
                    addSuffix: true,
                  })
                : "Unknown"}
            </span>
          </div>
        </div>

        <p className="text-lg mb-4 whitespace-pre-wrap leading-relaxed">
          {tweetData?.content}
        </p>

        {tweetData?.image && (
          <div className="mb-6 rounded-2xl overflow-hidden">
            <img
              src={tweetData.image}
              alt="Post image"
              className="w-full max-h-96 object-cover"
            />
          </div>
        )}

        {/* <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 pb-4 border-b">
          <span>
            <strong>{retweetCount}</strong> Retweets
          </span>
          <span>
            <strong>{likeCount}</strong> Likes
          </span>
          <span>
            <strong>{tweet.replies}</strong> Replies
          </span>
        </div> */}

        <div className="flex items-center justify-around text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>
          {/* <Button
            variant="ghost"
            size="sm"
            // onClick={handleRetweet}
            className={`flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 ${isRetweeted ? "text-green-500" : ""}`}
          >
            <Repeat className="h-5 w-5" />
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10 ${isLiked ? "text-red-500" : ""}`}
          >
            <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
          >
            <Share className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* auth user & reply box */}
      {authStatus && (
        <Card className="p-4 mb-6">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.data?.avatar} alt="You" />
              <AvatarFallback>
                {getInitials(user?.data?.fullname)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Tweet your reply..."
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown = {handleKeyDown}
                className="min-h-20 resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
              />
              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleReplySubmit}
                  disabled={!reply.trim() || isPosting}
                  className="rounded-full"
                >
                  {isPosting ? "Posting..." : "Reply"}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/*tweet replies */}
      <div className="space-y-0">
        {replies.map((reply, index) => (
          <Card
            key={reply._id}
            className="p-4 border-0 border-b border-border rounded-none animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex gap-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={reply?.owner?.avatar} alt="" />
                <AvatarFallback>
                  {getInitials(reply?.owner?.fullname)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  
                  <span className="text-muted-foreground">
                    @{reply?.owner?.username.toLowerCase()}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground text-sm">
                    {reply?.updatedAt && !isNaN(new Date(reply.updatedAt))
                      ? formatDistanceToNow(new Date(reply.updatedAt), {
                          addSuffix: true,
                        })
                      : "Unknown"}
                  </span>
                </div>
                <p className="mb-2">{reply?.content}</p>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Button variant="ghost" size="sm" className="h-8 w-20 px-0 flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Reply</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-0 flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-sm">{reply.likes}</span>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Tweet;
