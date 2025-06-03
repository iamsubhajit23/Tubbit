import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, MessageCircle, Repeat, Share, ArrowLeft } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/Avatar.jsx';
import { Card } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Textarea } from '../components/ui/TextArea';

const Tweet = () => {
    const { id } = useParams();
    const [newComment, setNewComment] = useState('');

    const tweet = {
        id: '1',
        content: `Just finished recording a new tutorial on React hooks! Can't wait to share it with you all 🚀\n\nWhat topics would you like to see next? Drop your suggestions below! 👇\n\n#React #JavaScript #WebDev`,
        username: 'TechCoder',
        userAvatar: '',
        timestamp: '2 hours ago',
        likes: 156,
        retweets: 23,
        replies: 42,
        images: ['https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=400&fit=crop']
    };

    const comments = [
        {
            id: '1',
            username: 'DevEnthusiast',
            content: 'Great tutorial! Would love to see something about useReducer next!',
            timestamp: '1h',
            likes: 12
        },
        {
            id: '2',
            username: 'ReactFan',
            content: 'Your explanations are always so clear. Thanks for sharing! 🙏',
            timestamp: '45m',
            likes: 8
        },
        {
            id: '3',
            username: 'WebDeveloper',
            content: 'Custom hooks tutorial would be amazing! Looking forward to it.',
            timestamp: '30m',
            likes: 15
        }
    ];

    const [isLiked, setIsLiked] = useState(false);
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [likeCount, setLikeCount] = useState(tweet.likes);
    const [retweetCount, setRetweetCount] = useState(tweet.retweets);

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleRetweet = () => {
        setIsRetweeted(!isRetweeted);
        setRetweetCount(prev => isRetweeted ? prev - 1 : prev + 1);
    };

    const handleComment = () => {
        if (newComment.trim()) {
            console.log('Adding comment:', newComment);
            setNewComment('');
        }
    };

    return (
        <div className="container mx-auto max-w-2xl px-4 py-6 animate-fade-in">
            <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
            </Button>

            <Card className="p-6 mb-6">
                <div className="flex gap-3 mb-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={tweet.userAvatar} alt={tweet.username} />
                        <AvatarFallback>{getInitials(tweet.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-lg">{tweet.username}</span>
                            <span className="text-muted-foreground">@{tweet.username.toLowerCase().replace(' ', '')}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">{tweet.timestamp}</span>
                    </div>
                </div>

                <p className="text-lg mb-4 whitespace-pre-wrap leading-relaxed">{tweet.content}</p>

                {tweet.images && tweet.images.length > 0 && (
                    <div className="mb-6 rounded-2xl overflow-hidden">
                        <img
                            src={tweet.images[0]}
                            alt="Post image"
                            className="w-full max-h-96 object-cover"
                        />
                    </div>
                )}

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4 pb-4 border-b">
                    <span><strong>{retweetCount}</strong> Retweets</span>
                    <span><strong>{likeCount}</strong> Likes</span>
                    <span><strong>{tweet.replies}</strong> Replies</span>
                </div>

                <div className="flex items-center justify-around text-muted-foreground">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10">
                        <MessageCircle className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRetweet}
                        className={`flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 ${isRetweeted ? 'text-green-500' : ''}`}
                    >
                        <Repeat className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleLike}
                        className={`flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10 ${isLiked ? 'text-red-500' : ''}`}
                    >
                        <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10">
                        <Share className="h-5 w-5" />
                    </Button>
                </div>
            </Card>

            <Card className="p-4 mb-6">
                <div className="flex gap-3">
                    <Avatar className="w-10 h-10">
                        <AvatarImage src="" alt="You" />
                        <AvatarFallback>YU</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Textarea
                            placeholder="Tweet your reply..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-20 resize-none border-0 bg-transparent text-base placeholder:text-muted-foreground focus-visible:ring-0"
                        />
                        <div className="flex justify-end mt-3">
                            <Button onClick={handleComment} disabled={!newComment.trim()} className="rounded-full">
                                Reply
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>

            <div className="space-y-0">
                {comments.map((comment, index) => (
                    <Card
                        key={comment.id}
                        className="p-4 border-0 border-b border-border rounded-none animate-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="flex gap-3">
                            <Avatar className="w-10 h-10">
                                <AvatarImage src="" alt={comment.username} />
                                <AvatarFallback>{getInitials(comment.username)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold">{comment.username}</span>
                                    <span className="text-muted-foreground">@{comment.username.toLowerCase()}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-muted-foreground text-sm">{comment.timestamp}</span>
                                </div>
                                <p className="mb-2">{comment.content}</p>
                                <div className="flex items-center gap-4 text-muted-foreground">
                                    <Button variant="ghost" size="sm" className="h-8 px-0">
                                        <MessageCircle className="h-4 w-4 mr-1" />
                                        <span className="text-sm">Reply</span>
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-8 px-0">
                                        <Heart className="h-4 w-4 mr-1" />
                                        <span className="text-sm">{comment.likes}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Tweet;
