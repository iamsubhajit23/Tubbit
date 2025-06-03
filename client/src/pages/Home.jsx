import React from 'react';
import VideoCard from '../components/VideoCard.jsx';
import SkeletonLoader from '../components/ui/SkeletonLoader.jsx';

const Home = () => {
    // Mock data - in a real app this would come from an API
    const videos = [
        {
            id: '1',
            thumbnail: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=225&fit=crop',
            title: 'Building Modern React Apps with TypeScript and Tailwind CSS',
            username: 'TechCoder',
            userAvatar: '',
            views: '125K views',
            timestamp: '2 days ago',
            duration: '15:32'
        },
        {
            id: '2',
            thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=225&fit=crop',
            title: 'JavaScript Tips and Tricks Every Developer Should Know',
            username: 'DevMaster',
            userAvatar: '',
            views: '89K views',
            timestamp: '1 week ago',
            duration: '22:45'
        },
        {
            id: '3',
            thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop',
            title: 'Understanding Circuit Boards and Electronics',
            username: 'ElectroNerd',
            userAvatar: '',
            views: '45K views',
            timestamp: '3 days ago',
            duration: '18:21'
        },
        {
            id: '4',
            thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=225&fit=crop',
            title: 'Advanced Java Programming Concepts',
            username: 'JavaGuru',
            userAvatar: '',
            views: '67K views',
            timestamp: '5 days ago',
            duration: '31:15'
        },
        {
            id: '5',
            thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop',
            title: 'MacBook Pro Tips for Developers',
            username: 'AppleTech',
            userAvatar: '',
            views: '156K views',
            timestamp: '1 day ago',
            duration: '12:30'
        },
        {
            id: '6',
            thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=225&fit=crop',
            title: 'Remote Work Setup and Productivity Tips',
            username: 'WorkFromHome',
            userAvatar: '',
            views: '98K views',
            timestamp: '4 days ago',
            duration: '25:18'
        }
    ];

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                            <SkeletonLoader className="aspect-video" />
                            <div className="flex gap-3">
                                <SkeletonLoader variant="circular" className="w-8 h-8 flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <SkeletonLoader className="h-4" />
                                    <SkeletonLoader className="h-3 w-2/3" />
                                    <SkeletonLoader className="h-3 w-1/2" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video, index) => (
                    <div
                        key={video.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <VideoCard {...video} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
