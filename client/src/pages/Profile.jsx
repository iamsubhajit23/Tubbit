import { useState, useEffect } from "react";
import { Calendar, MapPin, Link as LinkIcon, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { format, formatDistanceToNow } from "date-fns";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs.jsx";
import { Button } from "../components/ui/Button.jsx";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "../components/ui/Avatar.jsx";
import VideoCard from "../components/VideoCard.jsx";
import TweetCard from "../components/TweetCard.jsx";
import { getChannelProfile } from "../services/user/profile.api.js";
import successToast from "../utils/notification/success.js";
import errorToast from "../utils/notification/error.js";
import { getAllVideos } from "../services/video/video.api.js";
import { getAllTweets } from "../services/tweet/tweet.api.js";

const Profile = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userTweets, setUserTweets] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userVideosLoading, setUserVideosLoading] = useState(false);
  const { username } = useParams();
  const authUserData = useSelector((state) => state.auth.userData);
  const [selfProfile, setSelfProfile] = useState(false);

  useEffect(() => {
    if (authUserData?.data?.username === username) {
      setSelfProfile(true);
    } else {
      setSelfProfile(false);
    }
  }, [authUserData, username]);

  useEffect(() => {
    setProfileLoading(true);
    const fetchUserData = async () => {
      const res = await getChannelProfile(username);

      if (res.statuscode !== 200) {
        setProfileLoading(false);
        return;
      }
      setUserData(res.data);
      setProfileLoading(false);
    };
    fetchUserData();
  }, [username]);

  useEffect(() => {
    if (!userData?._id) return;
    setUserVideosLoading(true);
    const fetchUserVideos = async () => {
      const res = await getAllVideos({ userId: userData._id });

      if (res.statuscode !== 200) {
        setUserVideosLoading(false);
        return;
      }
      setUserVideos(res.data?.docs);
      setUserVideosLoading(false);
    };

    const fetchUserTweets = async () => {
      const res = await getAllTweets({ userId: userData?._id });

      if (res.statuscode !== 200) {
        return;
      }
      setUserTweets(res.data?.docs);
    };
    fetchUserVideos();
    fetchUserTweets();
  }, [userData]);

  const formatDuration = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const padded = (n) => String(n).padStart(2, "0");

    return h > 0
      ? `${padded(h)}:${padded(m)}:${padded(s)}`
      : `${padded(m)}:${padded(s)}`;
  };

  if (profileLoading)
    return <div className="text-center py-10">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div
          className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4"
          style={{
            backgroundImage: `Url(${userData?.coverimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 sm:-mt-12">
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-800">
            <AvatarImage
              src={userData?.avatar}
              alt={userData?.fullname.slice(0, 1).toUpperCase()}
            />
            <AvatarFallback>
              {userData?.fullname.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {userData?.fullname}
                  {selfProfile && (
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  @{userData?.username}
                </p>
              </div>

              {!selfProfile && (
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="ghost">Message</Button>
                </div>
              )}
            </div>

            <p className="text-gray-900 dark:text-white mt-4 max-w-2xl">
              {userData?.bio ||
                `Hello friends, I'm ${userData?.fullname}. Follow for more content.`}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{userData?.location || "West Bengal, India"}</span>
              </div>
              {userData?.website && (
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <a
                    href={userData?.website}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    {userData?.website}
                  </a>
                </div>
              )}

              {userData?.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />

                  <span>
                    Joined {format(new Date(userData?.createdAt), "MMMM yyyy")}
                  </span>
                </div>
              )}
            </div>

            <div className="flex space-x-6 mt-4">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {userData?.subscribersCount}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  Subscribers
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {userData?.channelSubscribedToCount}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  Subscribe To
                </span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">
                  {userVideos?.length || 0}
                </span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">
                  Videos
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="tweets">Tweets</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVideos.map((video) => (
              <VideoCard
                {...video}
                key={video._id}
                videoId={video._id}
                avatar={video.owner.avatar}
                hoverToPlay={false}
                duration={formatDuration(video.duration)}
                timestamp={formatDistanceToNow(new Date(video.createdAt), {
                  addSuffix: true,
                })}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tweets" className="mt-6 space-y-4">
          {userTweets.map((tweet) => (
            <TweetCard
              key={tweet?._id}
              tweetId={tweet?._id}
              content={tweet?.content}
              username={tweet?.owner?.username}
              fullname={tweet?.owner?.fullname}
              userAvatar={tweet?.owner?.avatar}
              timestamp={formatDistanceToNow(new Date(tweet?.updatedAt), {
                addSuffix: true,
              })}
              images={tweet?.image}
              {...tweet}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
