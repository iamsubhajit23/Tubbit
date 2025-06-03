import React, { useState, useEffect } from 'react';
import TweetCard from '../components/TweetCard.jsx';
import SkeletonLoader from '../components/ui/SkeletonLoader.jsx';

const Tweets = () => {
    const tweets = [
        {
            id: '1',
            content: 'Just finished recording a new tutorial on React hooks! Can\'t wait to share it with you all 🚀\n\nWhat topics would you like to see next? Drop your suggestions below! 👇\n\n#React #JavaScript #WebDev',
            username: 'TechCoder',
            userAvatar: '',
            timestamp: '2h',
            likes: 156,
            retweets: 23,
            replies: 42,
            images: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500&h=300&fit=crop']
        },
        {
            id: '2',
            content: 'Working on something exciting for the developer community. Stay tuned! 👨‍💻✨\n\nHint: It involves TypeScript and has lots of animations 😉',
            username: 'DevMaster',
            userAvatar: '',
            timestamp: '4h',
            likes: 89,
            retweets: 12,
            replies: 18
        },
        {
            id: '3',
            content: 'Beautiful circuit board patterns! The intersection of art and technology never fails to amaze me.\n\nElectronics can be so aesthetic when you look at them closely 🔬⚡',
            username: 'ElectroNerd',
            userAvatar: '',
            timestamp: '6h',
            likes: 234,
            retweets: 45,
            replies: 67,
            images: ['https://images.unsplash.com/photo-1518770660439-4636190af475?w=500&h=300&fit=crop']
        },
        {
            id: '4',
            content: 'Pro tip: The best way to learn programming is by building projects. Start small, think big! 💡\n\nEvery expert was once a beginner. Keep coding, keep learning! 🚀',
            username: 'JavaGuru',
            userAvatar: '',
            timestamp: '8h',
            likes: 445,
            retweets: 89,
            replies: 156
        },
        {
            id: '5',
            content: 'My current MacBook setup for development. Clean, minimal, and productive! ✨\n\nWhat does your coding setup look like? Share photos below! 📸',
            username: 'AppleTech',
            userAvatar: '',
            timestamp: '12h',
            likes: 678,
            retweets: 134,
            replies: 89,
            images: ['https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=500&h=300&fit=crop']
        },
        {
            id: '6',
            content: 'Remote work has changed everything. Here are my top 5 productivity tips for working from home:\n\n1. Dedicated workspace\n2. Regular breaks\n3. Good lighting\n4. Noise-canceling headphones\n5. Clear boundaries\n\nWhat works for you? 🏠💻',
            username: 'WorkFromHome',
            userAvatar: '',
            timestamp: '1d',
            likes: 567,
            retweets: 123,
            replies: 234,
            images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=300&fit=crop']
        }
    ];

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto max-w-2xl px-4 py-6">
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="border-b border-border pb-4 mb-4">
                        <div className="flex gap-3">
                            <SkeletonLoader variant="circular" className="w-10 h-10 flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center gap-2">
                                    <SkeletonLoader className="h-4 w-24" />
                                    <SkeletonLoader className="h-3 w-16" />
                                </div>
                                <SkeletonLoader className="h-4 w-full" />
                                <SkeletonLoader className="h-4 w-3/4" />
                                <SkeletonLoader className="h-32 w-full rounded-lg" />
                                <div className="flex gap-8">
                                    <SkeletonLoader className="h-4 w-12" />
                                    <SkeletonLoader className="h-4 w-12" />
                                    <SkeletonLoader className="h-4 w-12" />
                                    <SkeletonLoader className="h-4 w-8" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-2xl px-4 py-6 animate-fade-in">
            <div className="space-y-0">
                {tweets.map((post, index) => (
                    <div
                        key={post.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <TweetCard {...post} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tweets;
