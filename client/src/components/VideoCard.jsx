import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/Avatar.jsx';
import { Card } from './ui/Card.jsx';

const VideoCard = ({
    thumbnail,
    title,
    username,
    userAvatar,
    views,
    timestamp,
    duration
}) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <Card className="group cursor-pointer overflow-hidden border-0 bg-card/50 hover:bg-card transition-all duration-300 hover:shadow-lg hover-scale">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {duration}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex gap-3">
                    <Avatar className="mt-1 flex-shrink-0 w-8 h-8">
                        <AvatarImage src={userAvatar} alt={username} />
                        <AvatarFallback className="text-xs">
                            {getInitials(username)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-medium line-clamp-2 text-sm mb-1 group-hover:text-tubbit-primary transition-colors">
                            {title}
                        </h3>
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p className="hover:text-foreground transition-colors cursor-pointer">
                                {username}
                            </p>
                            <p>
                                {views} • {timestamp}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default VideoCard;
