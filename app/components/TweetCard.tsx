'use client';

import { Tweet } from '../page';
import { HeartIcon, RetweetIcon, ChatIcon, ShareIcon, DotsIcon } from './Icons';

interface TweetCardProps {
    tweet: Tweet;
    onUpdate: (tweet: Tweet, type: 'like' | 'retweet') => void;
}

export default function TweetCard({ tweet, onUpdate }: TweetCardProps) {
    const handleLike = () => {
        onUpdate(tweet, 'like');
    };

    const handleRetweet = () => {
        onUpdate(tweet, 'retweet');
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    };

    return (
        <div className="border-b border-gray-800 p-4 hover:bg-gray-950/50 transition-colors">
            <div className="flex space-x-3">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">
                        {tweet.username[0].toUpperCase()}
                    </span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <span className="font-bold">{tweet.username}</span>
                        <span className="text-gray-500">@{tweet.username}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500">
                            {formatTime(tweet.created_at)}
                        </span>
                        <div className="ml-auto">
                            <button className="text-gray-500 hover:text-gray-300 p-1">
                                <DotsIcon />
                            </button>
                        </div>
                    </div>
                    <div className="mt-1">
                        <p className="text-white whitespace-pre-wrap">
                            {tweet.content}
                        </p>
                    </div>
                    <div className="flex items-center justify-between mt-3 max-w-md">
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 group">
                            <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                                <ChatIcon />
                            </div>
                            <span className="text-sm">{tweet.replies}</span>
                        </button>
                        <button
                            onClick={handleRetweet}
                            className={`flex items-center space-x-2 group ${
                                tweet.retweeted
                                    ? 'text-green-500'
                                    : 'text-gray-500 hover:text-green-400'
                            }`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-green-400/10">
                                <RetweetIcon />
                            </div>
                            <span className="text-sm">{tweet.retweets}</span>
                        </button>
                        <button
                            onClick={handleLike}
                            className={`flex items-center space-x-2 group ${
                                tweet.liked
                                    ? 'text-red-500'
                                    : 'text-gray-500 hover:text-red-400'
                            }`}
                        >
                            <div className="p-2 rounded-full group-hover:bg-red-400/10">
                                <HeartIcon filled={tweet.liked} />
                            </div>
                            <span className="text-sm">{tweet.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-400 group">
                            <div className="p-2 rounded-full group-hover:bg-blue-400/10">
                                <ShareIcon />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
