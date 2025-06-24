import { useState, useEffect } from "react";
import { Calendar, MapPin, Link as LinkIcon, Edit, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
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
import { getAllVideos } from "../services/video/video.api.js";
import { getAllTweets } from "../services/tweet/tweet.api.js";

const Profile = () => {
  const [subscribed, setSubscribed] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userTweets, setUserTweets] = useState([]);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userVideosLoading, setUserVideosLoading] = useState(false);
  const { username } = useParams();
  const authUserData = useSelector((state) => state.auth.userData);
  const [selfProfile, setSelfProfile] = useState(false);
  const navigate = useNavigate();

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
      <div className="container mx-auto px-4">
        <div
          className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4"
          style={{
            backgroundImage: `Url(${userData?.coverimage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="mb-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col sm:flex-row gap-4 lg:w-2/3">
              <Avatar className="w-32 h-32 border-4 border-background bg-background rounded-full">
                <AvatarImage
                  src={userData?.avatar}
                  alt={userData?.fullname.slice(0, 1).toUpperCase()}
                />
                <AvatarFallback className="text-4xl font-bold bg-blue-500 text-white">
                  {userData?.fullname.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-1">
                  {userData?.fullname}
                </h1>
                <div className="flex flex-wrap items-center gap-1 text-sm mb-3">
                  <p className="text-foreground font-semibold">@{userData?.username}</p>

                  <div className="flex flex-wrap gap-1 text-muted-foreground">
                    <span>• {userData?.subscribersCount} subscribers</span>
                    <span>
                      • {userData?.channelSubscribedToCount} subscriptions
                    </span>
                    <span>• {userVideos?.length || 0} videos</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-3 max-w-2xl leading-relaxed">
                  {userData?.bio ||
                    `Hello friends, I'm ${userData?.fullname}. Follow for more content.`}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userData?.location || "West Bengal, India"}</span>
                  </div>
                  {userData?.createdAt && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Joined{" "}
                        {format(new Date(userData?.createdAt), "MMMM yyyy")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 lg:w-1/3 lg:justify-end">
            {selfProfile ? (
              <Button onClick={() => navigate("/settings")} variant="outline" className="rounded-full px-6">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <Button
                variant={subscribed ? "outline" : "default"}
                onClick={() => setSubscribed(!subscribed)}
                className="bg-black text-white hover:bg-gray-800 rounded-full px-6"
              >
                <Bell className="w-4 h-4 mr-2" />
                {subscribed ? "Subscribed" : "Subscribe"}
              </Button>
            )}
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
                fullname={video.owner.fullname}
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
