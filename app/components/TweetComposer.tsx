'use client';

import { useState } from 'react';
import {
    ImageIcon,
    GifIcon,
    PollIcon,
    EmojiHappyIcon,
    CalendarIcon,
} from './Icons';

interface TweetComposerProps {
    onTweet: (content: string) => void;
}

export default function TweetComposer({ onTweet }: TweetComposerProps) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const maxLength = 280;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (content.trim() && content.length <= maxLength && !loading) {
            setLoading(true);
            await onTweet(content.trim());
            setContent('');
            setLoading(false);
        }
    };

    const remainingChars = maxLength - content.length;

    return (
        <div className="border-b border-gray-800 p-4">
            <form onSubmit={handleSubmit}>
                <div className="flex space-x-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">Y</span>
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What's happening?"
                            className="w-full bg-transparent text-xl placeholder-gray-500 resize-none border-none outline-none text-white"
                            rows={3}
                            disabled={loading}
                        />
                        <div className="flex items-center justify-between mt-3">
                            <div className="flex space-x-4">
                                <button
                                    type="button"
                                    className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full"
                                >
                                    <ImageIcon />
                                </button>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full"
                                >
                                    <GifIcon />
                                </button>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full"
                                >
                                    <PollIcon />
                                </button>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full"
                                >
                                    <EmojiHappyIcon />
                                </button>
                                <button
                                    type="button"
                                    className="text-blue-400 hover:bg-blue-400/10 p-2 rounded-full"
                                >
                                    <CalendarIcon />
                                </button>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span
                                    className={`text-sm ${
                                        remainingChars < 20
                                            ? 'text-red-500'
                                            : 'text-gray-500'
                                    }`}
                                >
                                    {remainingChars}
                                </span>
                                <button
                                    type="submit"
                                    disabled={
                                        !content.trim() ||
                                        content.length > maxLength ||
                                        loading
                                    }
                                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-full font-bold"
                                >
                                    {loading ? 'Tweeting...' : 'Tweet'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
