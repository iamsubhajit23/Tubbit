import { useState, useEffect,} from "react";
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
import errorToast from "../utils/notification/error.js";
import { getAllVideos, getVideoById } from "../services/video/video.api.js";
import RelatedVideoCard from "../components/RelatedVideoCard.jsx";
import RelatedVideoSkeleton from "../components/RelatedVideoSkeleton.jsx";

const Watch = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [videoData, setVideoData] = useState();
  const [comments, setComments] = useState([]);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const { videoId } = useParams();
  const authUserData = useSelector((state) => state.auth.userData);
  const user = authUserData || {};
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVideo = async () => {
      const response = await getVideoById(videoId);
      if (response.statuscode !== 200) {
        errorToast("Failed to fetch video");
        return;
      }
      setVideoData(response?.data);
    };
    const fetchComments = async () => {
      const response = await getVideoComments(videoId);

      if (response.statuscode !== 200) {
        errorToast("Failed to fetch video comments");
        return;
      }
      setComments(response?.data?.comments);
    };

    const fetchRelatedVideos = async () => {
      setIsLoadingRelated(true)
      const response = await getAllVideos({
        query: "",
        sortBy: "createdAt",
        sortType: "asc",
        userId: "",
      });

      if (response.statuscode !== 200) {
        errorToast("Failed to fetch related videos");
        return;
      }
      setRelatedVideos(response?.data?.docs?.filter(v => v._id !== videoId));
      setIsLoadingRelated(false);
    };

    window.scrollTo(0,0);
    fetchVideo();
    fetchComments();
    fetchRelatedVideos();
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
                    onClick={() => {
                      setIsLiked(!isLiked);
                      if (isDisliked) setIsDisliked(false);
                    }}
                    className={`rounded-l-full ${isLiked ? "text-blue-600" : ""}`}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    125K
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDisliked(!isDisliked);
                      if (isLiked) setIsLiked(false);
                    }}
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
            <h2 className="text-xl font-bold">Comments ({comments.length})</h2>
            <div className="flex space-x-3">
              <Avatar>
                <AvatarImage src={user?.data?.avatar} />
                <AvatarFallback>
                  {" "}
                  {user?.data?.fullname?.slice(0, 1).toUpperCase()}{" "}
                </AvatarFallback>
              </Avatar>
              <input
                type="text"
                placeholder="Add a comment..."
                className="w-full border-b border-gray-300 bg-transparent focus:outline-none py-2"
              />
            </div>

            {comments?.map((comment) => (
              <div key={comment?._id} className="flex space-x-3 mt-4">
                <Avatar>
                  <AvatarImage src={comment?.owner?.avatar} />
                  <AvatarFallback>
                    {comment?.owner?.fullname?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold">
                      {comment?.owner?.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      •{" "}
                      {comment.createdAt
                        ? formatDistanceToNow(new Date(comment?.createdAt), {
                            addSuffix: true,
                          })
                        : "just now"}
                    </span>
                  </div>
                  <p>{comment?.content}</p>
                  <div className="flex space-x-2 text-sm text-gray-500 mt-1">
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
