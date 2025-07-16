'use client';

import { Tweet } from '../page';
import TweetCard from './TweetCard';

interface TweetFeedProps {
    tweets: Tweet[];
    onUpdateTweet: (tweet: Tweet, type: 'like' | 'retweet') => void;
    loading?: boolean;
}

export default function TweetFeed({
    tweets,
    onUpdateTweet,
    loading,
}: TweetFeedProps) {
    if (loading) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>Loading tweets...</p>
            </div>
        );
    }

    if (tweets.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-xl mb-2">No tweets yet</p>
                <p>Be the first to tweet something!</p>
            </div>
        );
    }

    return (
        <div>
            {tweets.map((tweet) => (
                <TweetCard
                    key={tweet.id}
                    tweet={tweet}
                    onUpdate={onUpdateTweet}
                />
            ))}
        </div>
    );
}
