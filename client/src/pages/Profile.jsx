import { useState, useEffect } from 'react';
import { Calendar, MapPin, Link as LinkIcon, Pencil } from 'lucide-react';
import { useSelector } from 'react-redux';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar.jsx';
import  VideoCard  from '../components/VideoCard.jsx';
import TweetCard  from '../components/TweetCard.jsx';
import { getChannelProfile } from '../services/user/profile.api.js';

const Profile = ({ userId, selfProfile = false }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [userTweets, setUserTweets] = useState([]);

  useEffect(async () => {
    // Simulate API call

    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUserData(data);
        setUserVideos(data.videos);
        setUserTweets(data.tweets);
        setIsFollowing(data.isFollowing);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Profile Header */}
      <div className="relative mb-8">
        <div 
          className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-4"
          style={{
            backgroundImage: `url(${userData.bannerUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />

        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 sm:-mt-12">
          <Avatar className="w-20 h-20 border-4 border-white dark:border-gray-800">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} />
            <AvatarFallback>{userData.initials}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {userData.name}
                  {selfProfile && (
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">@{userData.username}</p>
              </div>

              {!selfProfile && (
                <div className="flex space-x-3 mt-4 sm:mt-0">
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={() => setIsFollowing(!isFollowing)}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Button>
                  <Button variant="ghost">Message</Button>
                </div>
              )}
            </div>

            <p className="text-gray-900 dark:text-white mt-4 max-w-2xl">
              {userData.bio}
            </p>

            <div className="flex flex-wrap items-center gap-6 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{userData.location}</span>
              </div>
              <div className="flex items-center space-x-1">
                <LinkIcon className="w-4 h-4" />
                <a href={userData.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                  {userData.website}
                </a>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined {userData.joinDate}</span>
              </div>
            </div>

            <div className="flex space-x-6 mt-4">
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{userData.subscribers}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Subscribers</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{userData.following}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Following</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 dark:text-white">{userData.videos}</span>
                <span className="text-gray-600 dark:text-gray-400 ml-1">Videos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userVideos.map((video) => (
              <VideoCard key={video.id} {...video} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="posts" className="mt-6 space-y-4">
          {userTweets.map((tweet) => (
            <TweetCard key={tweet.id} {...tweet} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
