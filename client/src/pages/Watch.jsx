import React, { useState } from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Textarea } from '../components/ui/TextArea.jsx';
import { Card } from '../components/ui/Card.jsx';

const Watch = () => {
    const [liked, setLiked] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [comment, setComment] = useState('');
    const [allComments, setAllComments] = useState([
        {
            id: '1',
            username: 'DevLover',
            avatar: '',
            content: 'Great tutorial! Really helped me understand the concepts better.',
            timestamp: '2 hours ago',
            likes: 15
        },
        {
            id: '2',
            username: 'CodeNewbie',
            avatar: '',
            content: 'Could you make a follow-up video on advanced patterns?',
            timestamp: '4 hours ago',
            likes: 8
        },
        {
            id: '3',
            username: 'WebDev2023',
            avatar: '',
            content: 'The explanation at 10:30 was particularly helpful. Thanks!',
            timestamp: '1 day ago',
            likes: 23
        }
    ]);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            username: 'John Doe',
            avatar: '',
            content: comment,
            timestamp: 'Just now',
            likes: 0
        };
        setAllComments([newComment, ...allComments]);
        setComment('');
    };

    return (
        <div className="container mx-auto px-4 py-6 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Video Section */}
                <div className="lg:col-span-2 space-y-4">
                    {/* Video Player */}
                    <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        <img
                            loading="lazy"
                            src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=800&h=450&fit=crop"
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Video Info */}
                    <div className="space-y-4">
                        <h1 className="text-xl sm:text-2xl font-bold">
                            Building Modern React Apps with TypeScript and Tailwind CSS
                        </h1>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="text-sm text-muted-foreground">
                                125,432 views • Dec 15, 2023
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant={liked ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setLiked(!liked)}
                                    className="hover-scale"
                                >
                                    👍 {liked ? '1.3K' : '1.2K'}
                                </Button>
                                <Button variant="outline" size="sm" className="hover-scale">
                                    👎
                                </Button>
                                <Button variant="outline" size="sm" className="hover-scale">
                                    🔗 Share
                                </Button>
                            </div>
                        </div>

                        {/* Channel Info */}
                        <Card className="p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src="" alt="TechCoder" />
                                        <AvatarFallback>TC</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-semibold">TechCoder</h3>
                                        <p className="text-sm text-muted-foreground">1.2M subscribers</p>
                                    </div>
                                </div>
                                <Button
                                    variant={subscribed ? "outline" : "default"}
                                    onClick={() => setSubscribed(!subscribed)}
                                    className="hover-scale"
                                >
                                    {subscribed ? 'Subscribed' : 'Subscribe'}
                                </Button>
                            </div>
                            <div className="mt-3">
                                <p className="text-sm text-muted-foreground">
                                    In this comprehensive tutorial, we'll build a modern React application using TypeScript and Tailwind CSS. Perfect for developers looking to level up their frontend skills!
                                </p>
                            </div>
                        </Card>

                        {/* Comments Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Comments ({allComments.length})</h3>

                            {/* Add Comment */}
                            <div className="flex gap-3">
                                <Avatar className="w-8 h-8">
                                    <AvatarImage src="" alt="John Doe" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-3">
                                    <Textarea
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="min-h-[80px] resize-none"
                                    />
                                    <div className="flex gap-2">
                                        <Button size="sm" disabled={!comment.trim()} onClick={handleAddComment}>
                                            Comment
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => setComment('')}>
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {allComments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 animate-fade-in">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={comment.avatar} alt={comment.username} />
                                            <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-sm">{comment.username}</span>
                                                <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                                            </div>
                                            <p className="text-sm mb-2">{comment.content}</p>
                                            <div className="flex items-center gap-4">
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                                    👍 {comment.likes}
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                                    👎
                                                </Button>
                                                <Button variant="ghost" size="sm" className="h-auto p-0 text-xs">
                                                    Reply
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                    <h3 className="font-semibold">Up Next</h3>
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Card key={i} className="p-3 cursor-pointer hover:bg-muted/50 transition-colors hover-scale">
                                <div className="flex gap-3">
                                    <div className="aspect-video w-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                        <img
                                            loading="lazy"
                                            src={`https://images.unsplash.com/photo-${1488590528505 + i}?w=128&h=72&fit=crop`}
                                            alt="Video thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                            Related Video Title {i + 1}
                                        </h4>
                                        <p className="text-xs text-muted-foreground">Channel Name</p>
                                        <p className="text-xs text-muted-foreground">50K views • 1 day ago</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watch;
