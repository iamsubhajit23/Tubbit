import { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Flag,
  Bell,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../components/ui/Button.jsx";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import { Card } from "../components/ui/Card.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { getVideoComments } from "../services/comment/comment.api.js";
import { getAllVideos, getVideoById } from "../services/video/video.api.js";
import RelatedVideoCard from "../components/RelatedVideoCard.jsx";
import RelatedVideoSkeleton from "../components/RelatedVideoSkeleton.jsx";
import CommentBox from "../components/comment/CommentBox.jsx";
import CommentControl from "../components/comment/CommentControl.jsx";
import {
  toggleLikeOnVideo,
  getLikesOnVideo,
} from "../services/like/like.api.js";
import successToast from "../utils/notification/success.js";
import errorToast from "../utils/notification/error.js";
import warningToast from "../utils/notification/warning.js";

const Watch = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [videoLikesCount, setVideoLikesCount] = useState(0);
  const [videoData, setVideoData] = useState();
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const { videoId } = useParams();
  const authStatus = useSelector((state) => state.auth.status);
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await getVideoById(videoId);
      if (response.statuscode !== 200) {
        errorToast("Failed to fetch video");
        return;
      }
      setVideoData(response?.data);
    };

    const fetchRelatedVideos = async () => {
      setIsLoadingRelated(true);
      const response = await getAllVideos({
        query: "",
        sortBy: "views",
        sortType: "desc",
        userId: "",
      });

      if (response.statuscode !== 200) {
        errorToast("Failed to fetch related videos");
        return;
      }
      setRelatedVideos(response?.data?.docs?.filter((v) => v._id !== videoId));
      setIsLoadingRelated(false);
    };

    window.scrollTo(0, 0);
    fetchVideo();
    fetchRelatedVideos();
  }, [videoId]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await getVideoComments(videoId);

      if (response.statuscode !== 200) {
        errorToast("Failed to fetch video comments");
        return;
      }

      setComments(response?.data?.comments);
    };

    if (videoId) {
      fetchComments();
    }
  }, [videoId]);

  const handleLikeOnVideo = async () => {
    if (!authStatus) {
      warningToast("Please log in to like videos");
      return;
    }

    const res = await toggleLikeOnVideo(videoId);

    if (![200, 201].includes(res.statuscode)) {
      errorToast("Failed to like video");
      return;
    }

    let updatedLikesCount = videoLikesCount;

    if (isLiked) {
      updatedLikesCount = Math.max(0, videoLikesCount - 1);
      setIsLiked(false);
    } else {
      updatedLikesCount = videoLikesCount + 1;
      setIsLiked(true);

      if (isDisliked) {
        setIsDisliked(false);
      }
    }

    setVideoLikesCount(updatedLikesCount);
  };

  const handleDislikeOnVideo = () => {
    if (!authStatus) {
      warningToast("Please log in to dislike videos");
      return;
    }

    setIsDisliked((prev) => !prev);

    if (isLiked) {
      setIsLiked(false);
      setVideoLikesCount((prev) => Math.max(0, prev - 1));
    }
  };

  useEffect(() => {
    const fetchVideoLikes = async () => {
      const res = await getLikesOnVideo(videoId);

      if (res.statuscode !== 200) {
        errorToast("Failed to fetch video likes");
        return;
      }

      setVideoLikesCount(res.data.totalLikes);
    };

    if (videoId) {
      fetchVideoLikes();
    }
  }, [videoId]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
            <VideoPlayer src={videoData?.videofile} />
          </div>

          {/* Video Info & Channel */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">{videoData?.title}</h1>

            <div className="flex justify-between flex-wrap items-center gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={videoData?.owner?.avatar} />
                  <AvatarFallback>
                    {videoData?.owner?.fullname?.slice(0, 1).toUpperCase() ||
                      "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {videoData?.owner?.fullname}
                  </h3>
                  {/* <p className="text-sm text-gray-500">1.2M subscribers</p> */}
                </div>
                <Button onClick={() => setIsSubscribed(!isSubscribed)}>
                  <Bell className="w-4 h-4 mr-2" />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-full dark:bg-gray-800">
                  <Button
                    onClick={handleLikeOnVideo}
                    className={`rounded-l-full ${isLiked ? "text-blue-600" : ""}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {videoLikesCount}
                  </Button>

                  <Button
                    onClick={handleDislikeOnVideo}
                    className={`rounded-r-full ${isDisliked ? "text-red-600" : ""}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="ghost">
                  <Share className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button variant="ghost">
                  <Download className="w-4 h-4 mr-2" /> Download
                </Button>
                <Button variant="ghost">
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Description */}
            <Card className="p-4 text-sm text-gray-600 dark:text-gray-400">
              {videoData?.views} views •{" "}
              {videoData?.createdAt
                ? formatDistanceToNow(new Date(videoData.createdAt), {
                    addSuffix: true,
                  })
                : "just now"}
              <br />
              {videoData?.description}
            </Card>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">{comments.length} Comments </h2>
            {authStatus && (
              <div className="flex space-x-3">
                <Avatar>
                  <AvatarImage src={user?.data?.avatar} />
                  <AvatarFallback>
                    {" "}
                    {user?.data?.fullname?.slice(0, 1).toUpperCase()}{" "}
                  </AvatarFallback>
                </Avatar>
                <CommentBox videoId={videoId} setComments={setComments} />
              </div>
            )}

            {comments?.map((comment) => (
              <div key={comment?._id} className="flex space-x-3 mt-4">
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src={comment?.owner?.avatar} />
                  <AvatarFallback>
                    {comment?.owner?.fullname?.[0]}
                  </AvatarFallback>
                </Avatar>

                {/* Comment body */}
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">
                        {comment?.owner?.username}
                      </span>
                      <span className="text-sm  text-muted-foreground">
                        •{" "}
                        {comment.updatedAt
                          ? formatDistanceToNow(new Date(comment?.updatedAt), {
                              addSuffix: true,
                            })
                          : "just now"}
                      </span>
                    </div>

                    {/* 🎯 Comment menu */}
                    <CommentControl
                      comment={comment}
                      authUserId={user?.data?._id}
                      setComments={setComments}
                    />
                  </div>

                  {/* Comment content */}
                  <p className="mt-1 text-sm leading-snug">
                    {comment?.content}
                  </p>

                  {/* Actions */}
                  <div className="flex space-x-2 text-sm text-muted-foreground mt-1">
                    <Button variant="ghost" size="sm">
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      {comment.likes}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <ThumbsDown className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      Reply
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <h3 className="font-semibold">Related Videos</h3>

          {isLoadingRelated
            ? Array.from({ length: 5 }).map((_, idx) => (
                <RelatedVideoSkeleton key={idx} />
              ))
            : relatedVideos.map((video) => (
                <div
                  key={video._id}
                  className="flex space-x-3"
                  onClick={() => navigate(`/watch/${video._id}`)}
                >
                  <RelatedVideoCard
                    {...video}
                    videoId={video._id}
                    videoUrl={video.videofile}
                    fullname={video.owner.fullname}
                    timestamp={formatDistanceToNow(new Date(video.createdAt), {
                      addSuffix: true,
                    })}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Watch;
