import { useState, useEffect } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Flag,
  Bell,
  MoreHorizontal,
  Bookmark,
  X,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { Button } from "../components/ui/Button.jsx";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../components/ui/DropDownMenu.jsx";
import { Card } from "../components/ui/Card.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";
import { getVideoComments } from "../services/comment/comment.api.js";
import {
  getAllVideos,
  getVideoById,
  getVideoDownloadLink,
} from "../services/video/video.api.js";
import RelatedVideoCard from "../components/RelatedVideoCard.jsx";
import RelatedVideoSkeleton from "../components/RelatedVideoSkeleton.jsx";
import CommentBox from "../components/comment/CommentBox.jsx";
import CommentControl from "../components/comment/CommentControl.jsx";
import {
  toggleLikeOnVideo,
  getLikesOnVideo,
} from "../services/like/like.api.js";
import {
  getSubscribers,
  toggleSubscription,
} from "../services/subscription/subscription.api.js";
import errorToast from "../utils/notification/error.js";
import warningToast from "../utils/notification/warning.js";
import { toggleSubscribedChannel } from "../store/slices/subscriptionSlice.js";
import { toggleLike } from "../store/slices/likeSlice.js";
import { addVideoToWatchHistory } from "../services/user/profile.api.js";
import successToast from "../utils/notification/success.js";

const Watch = () => {
  const [videoData, setVideoData] = useState();
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [isDislike, setIsDislike] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const authStatus = useSelector((state) => state.auth.status);
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};

  const subscribedChannels = useSelector(
    (state) => state.subscription.subscribedChannels
  );
  const isSubscribed = subscribedChannels.includes(videoData?.owner?._id);

  const likedVideos = useSelector((state) => state.like.likedVideos);
  const isLiked = likedVideos.includes(videoId);

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

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

    const addVideoIdToHistory = async (videoId) => {
      const res = await addVideoToWatchHistory(videoId);

      if (res.statuscode !== 200) {
        console.log("Failed to add video to watch history");
        return;
      }
    };

    window.scrollTo(0, 0);
    fetchVideo();
    fetchRelatedVideos();
    addVideoIdToHistory(videoId);
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

  useEffect(() => {
    const fetchVideoLikes = async () => {
      const res = await getLikesOnVideo(videoId);
      if (res.statuscode === 200) {
        setLikeCount(res.data?.totalLikes);
      }
    };

    if (videoId) {
      fetchVideoLikes();
    }
  }, [videoId]);

  useEffect(() => {
    const fetchSubscribersCount = async () => {
      if (!videoData?.owner?._id) return;

      const res = await getSubscribers(videoData?.owner?._id);
      if (res.statuscode === 200) {
        setSubscribersCount(res.data?.totalSubscriber);
      }
    };

    fetchSubscribersCount();
  }, [videoData]);

  const handleLike = async () => {
    if (!authStatus) {
      warningToast("Please Sign in to like videos");
      return;
    }

    const wasLiked = liked;
    const res = await toggleLikeOnVideo(videoId);

    if ([200, 201].includes(res.statuscode)) {
      const toggled = !wasLiked;
      setLiked(toggled);
      setIsDislike(false);

      setLikeCount((prev) => (toggled ? prev + 1 : Math.max(0, prev - 1)));

      dispatch(toggleLike(videoId));
    } else {
      errorToast("Failed to toggle like");
    }
  };

  const handleDislike = async () => {
    if (!authStatus) {
      warningToast("Please Sign in to dislike videos");
      return;
    }

    if (liked) {
      const res = await toggleLikeOnVideo(videoId);

      if ([200, 201].includes(res.statuscode)) {
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
        dispatch(toggleLike(videoId));
      } else {
        errorToast("Failed to dislike video");
        return;
      }
    }

    setIsDislike((prev) => !prev);
  };

  const handleSubscribeButton = async () => {
    if (!authStatus) {
      warningToast("Please sign in to subscribe");
      return;
    }

    const res = await toggleSubscription(videoData?.owner?._id);
    if (res.statuscode !== 200) {
      errorToast("Failed to toggle subscription!");
      return;
    }

    dispatch(toggleSubscribedChannel(videoData?.owner?._id));
    setSubscribersCount((prev) =>
      isSubscribed ? Math.max(0, prev - 1) : prev + 1
    );
  };

  const handleVideoDownload = async () => {
    setDownloadLoading(true);
    const res = await getVideoDownloadLink(videoData?.videofilepublicid);

    if (res?.statuscode !== 200 || !res?.data?.url) {
      errorToast(`${res?.data?.message}`);
      setDownloadLoading(false);
      return;
    }

    console.log("Link: ", res?.data?.url)
    
    window.open(res?.data?.url, "_blank")

    successToast("Download started");
    setDownloadLoading(false);
  };

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
                <Avatar
                  onClick={() =>
                    navigate(`/profile/${videoData?.owner?.username}`)
                  }
                  className="w-12 h-12 cursor-pointer"
                >
                  <AvatarImage src={videoData?.owner?.avatar} />
                  <AvatarFallback>
                    {videoData?.owner?.fullname?.[0]?.toUpperCase() || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3
                    onClick={() =>
                      navigate(`/profile/${videoData?.owner?.username}`)
                    }
                    className="font-semibold cursor-pointer"
                  >
                    {videoData?.owner?.fullname}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {subscribersCount} subscribers
                  </p>
                </div>
                <Button
                  variant={isSubscribed ? "outline" : "default"}
                  onClick={handleSubscribeButton}
                  className="rounded-full px-6"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  {isSubscribed ? "Subscribed" : "Subscribe"}
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex bg-gray-100 rounded-full dark:bg-gray-800">
                  <Button
                    onClick={handleLike}
                    className={`rounded-l-full ${liked ? "text-blue-600" : ""}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    {likeCount}
                  </Button>

                  <Button
                    onClick={handleDislike}
                    className={`rounded-r-full ${isDislike ? "text-red-600" : ""}`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="ghost">
                  <Share className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleVideoDownload}
                  disabled={downloadLoading}
                >
                  {downloadLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" /> Download
                    </>
                  )}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" align="end">
                    <DropdownMenuItem onClick={() => alert("Report video")}>
                      <Flag className="w-4 h-4 mr-2" /> Report
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => alert("Save to playlist")}>
                      <Bookmark className="w-4 h-4 mr-2" /> Save to playlist
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => alert("Not interested")}>
                      <X className="w-4 h-4 mr-2" /> Not interested
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
              <div className="flex space-x-3 cursor-pointer">
                <Avatar
                  onClick={() => navigate(`/profile/${user?.data?.username}`)}
                >
                  <AvatarImage src={user?.data?.avatar} />
                  <AvatarFallback>
                    {user?.data?.fullname?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CommentBox videoId={videoId} setComments={setComments} />
              </div>
            )}

            {comments?.map((comment) => (
              <div
                key={comment?._id}
                className="flex space-x-3 mt-4 cursor-pointer"
              >
                <Avatar
                  onClick={() =>
                    navigate(`/profile/${comment?.owner?.username}`)
                  }
                >
                  <AvatarImage src={comment?.owner?.avatar} />
                  <AvatarFallback>
                    {comment?.owner?.fullname?.[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">
                        {comment?.owner?.username}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        •{" "}
                        {comment.updatedAt
                          ? formatDistanceToNow(new Date(comment?.updatedAt), {
                              addSuffix: true,
                            })
                          : "just now"}
                      </span>
                    </div>

                    <CommentControl
                      comment={comment}
                      authUserId={user?.data?._id}
                      setComments={setComments}
                      controllerFor="video"
                    />
                  </div>

                  <p className="mt-1 text-sm leading-snug">
                    {comment?.content}
                  </p>

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
