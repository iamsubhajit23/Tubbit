import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs.jsx';
import VideoCard from '../components/VideoCard.jsx';
import { Card } from '../components/ui/Card.jsx';

const Profile = () => {
    const [following, setFollowing] = useState(false);

    const userVideos = [
        {
            id: '1',
            thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop',
            title: 'Building Modern React Apps',
            username: 'TechCoder',
            views: '125K views',
            timestamp: '2 days ago',
            duration: '15:32'
        },
        {
            id: '2',
            thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
            title: 'JavaScript Advanced Concepts',
            username: 'TechCoder',
            views: '89K views',
            timestamp: '1 week ago',
            duration: '22:45'
        }
    ];

    const userTweets = [
        {
            id: '1',
            content: 'Just finished recording a new tutorial on React hooks! Can\'t wait to share it with you all 🚀 #React #JavaScript',
            timestamp: '2 hours ago',
            likes: 45,
            retweets: 12,
            replies: 8
        },
        {
            id: '2',
            content: 'Working on something exciting for the developer community. Stay tuned! 👨‍💻✨',
            timestamp: '1 day ago',
            likes: 78,
            retweets: 23,
            replies: 15
        },
        {
            id: '3',
            content: 'Remember: the best way to learn programming is by building projects. Start small, think big! 💡',
            timestamp: '3 days ago',
            likes: 156,
            retweets: 67,
            replies: 34
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Banner */}
            <div className="h-32 sm:h-48 bg-gradient-to-r from-tubbit-primary to-tubbit-secondary relative">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            <div className="container mx-auto px-4 -mt-16 sm:-mt-20 relative z-10">
                {/* Profile Header */}
                <div className="bg-card rounded-xl border p-6 mb-6 animate-slide-up">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
                        <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-background">
                            <AvatarImage src="" alt="TechCoder" />
                            <AvatarFallback className="text-2xl">TC</AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h1 className="text-2xl sm:text-3xl font-bold mb-2">TechCoder</h1>
                            <p className="text-muted-foreground mb-3">
                                Full-stack developer passionate about modern web technologies.
                                Sharing knowledge through tutorials and tips! 🚀
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                                <span>1.2M subscribers</span>
                                <span>•</span>
                                <span>89 videos</span>
                                <span>•</span>
                                <span>Joined Dec 2020</span>
                            </div>

                            <Button
                                variant={following ? "outline" : "default"}
                                onClick={() => setFollowing(!following)}
                                className="hover-scale"
                            >
                                {following ? 'Following' : 'Follow'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Tabs */}
                <Tabs defaultValue="videos" className="animate-fade-in">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="videos">Videos ({userVideos.length})</TabsTrigger>
                        <TabsTrigger value="tweets">Posts ({userTweets.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="videos" className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {userVideos.map((video, index) => (
                                <div
                                    key={video.id}
                                    className="animate-slide-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <VideoCard {...video} />
                                </div>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="tweets" className="space-y-4">
                        {userTweets.map((tweet, index) => (
                            <Card
                                key={tweet.id}
                                className="p-6 animate-slide-up hover:shadow-md transition-shadow"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src="" alt="TechCoder" />
                                        <AvatarFallback>TC</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="font-semibold">TechCoder</span>
                                            <span className="text-muted-foreground">@techcoder</span>
                                            <span className="text-muted-foreground">•</span>
                                            <span className="text-muted-foreground text-sm">{tweet.timestamp}</span>
                                        </div>
                                        <p className="mb-3">{tweet.content}</p>
                                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                            <button className="hover:text-tubbit-primary transition-colors flex items-center gap-1">
                                                💬 {tweet.replies}
                                            </button>
                                            <button className="hover:text-green-500 transition-colors flex items-center gap-1">
                                                🔄 {tweet.retweets}
                                            </button>
                                            <button className="hover:text-red-500 transition-colors flex items-center gap-1">
                                                ❤️ {tweet.likes}
                                            </button>
                                            <button className="hover:text-blue-500 transition-colors">
                                                🔗
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;
