import React, { useState } from 'react';
import { Heart, MessageCircle, Repeat, Share, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar.jsx';
import { Card } from './ui/Card.jsx';
import { Button } from './ui/Button.jsx';

const TweetCard = ({
    content,
    username,
    userAvatar,
    timestamp,
    likes,
    retweets,
    replies,
    images
}) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [likeCount, setLikeCount] = useState(likes);
    const [retweetCount, setRetweetCount] = useState(retweets);

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleLike = () => {
        setIsLiked(!isLiked);
        setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    };

    const handleRetweet = () => {
        setIsRetweeted(!isRetweeted);
        setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
    };

    return (
        <Card className="p-4 hover:bg-card/80 transition-colors cursor-pointer border-0 border-b border-border rounded-none">
            <div className="flex gap-3">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={userAvatar} alt={username} />
                    <AvatarFallback>{getInitials(username)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold hover:underline cursor-pointer">{username}</span>
                        <span className="text-muted-foreground">@{username.toLowerCase().replace(' ', '')}</span>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-muted-foreground text-sm">{timestamp}</span>
                        <div className="ml-auto">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <p className="text-foreground mb-3 whitespace-pre-wrap">{content}</p>

                    {images && images.length > 0 && (
                        <div className="mb-3 rounded-2xl overflow-hidden">
                            {images.length === 1 ? (
                                <img
                                    src={images[0]}
                                    alt="Post image"
                                    className="w-full max-h-96 object-cover"
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-1">
                                    {images.slice(0, 4).map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`Post image ${index + 1}`}
                                            className="w-full h-48 object-cover"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex items-center justify-between max-w-md text-muted-foreground">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
                        >
                            <MessageCircle className="h-4 w-4" />
                            <span className="text-sm">{replies}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRetweet}
                            className={`flex items-center gap-2 hover:text-green-500 hover:bg-green-500/10 ${isRetweeted ? 'text-green-500' : ''
                                }`}
                        >
                            <Repeat className="h-4 w-4" />
                            <span className="text-sm">{retweetCount}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleLike}
                            className={`flex items-center gap-2 hover:text-red-500 hover:bg-red-500/10 ${isLiked ? 'text-red-500' : ''
                                }`}
                        >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span className="text-sm">{likeCount}</span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:text-blue-500 hover:bg-blue-500/10"
                        >
                            <Share className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default TweetCard;
