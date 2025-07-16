'use client';

import { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import TweetComposer from './components/TweetComposer';
import TweetFeed from './components/TweetFeed';
import { useAuth } from './hooks/useAuth';

export interface Tweet {
    id: number;
    content: string;
    username: string;
    user_id: number;
    likes: number;
    retweets: number;
    replies: number;
    created_at: string;
    liked?: boolean;
    retweeted?: boolean;
}

export default function Home() {
    const { user, token, loading, login, logout, isAuthenticated } = useAuth();
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [loadingTweets, setLoadingTweets] = useState(false);

    const fetchTweets = async () => {
        setLoadingTweets(true);
        try {
            const headers: HeadersInit = {};
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetch('/api/tweets', { headers });
            if (response.ok) {
                const data = await response.json();
                setTweets(data);
            }
        } catch (error) {
            console.error('Error fetching tweets:', error);
        } finally {
            setLoadingTweets(false);
        }
    };

    useEffect(() => {
        if (!loading) {
            const fetchTweets = async () => {
                setLoadingTweets(true);
                try {
                    const headers: HeadersInit = {};
                    if (token) {
                        headers.Authorization = `Bearer ${token}`;
                    }
                    const response = await fetch('/api/tweets', { headers });
                    if (response.ok) {
                        const data = await response.json();
                        setTweets(data);
                    }
                } catch (error) {
                    console.error('Error fetching tweets:', error);
                } finally {
                    setLoadingTweets(false);
                }
            };
            fetchTweets();
        }
    }, [loading, token]);

    const addTweet = async (content: string) => {
        if (!token) return;

        try {
            const response = await fetch('/api/tweets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (response.ok) {
                const newTweet = await response.json();
                setTweets([newTweet, ...tweets]);
            }
        } catch (error) {
            console.error('Error creating tweet:', error);
        }
    };

    const updateTweet = async (tweet: Tweet, type: 'like' | 'retweet') => {
        if (!token) return;

        try {
            const response = await fetch(`/api/tweets/${tweet.id}/interact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ type }),
            });

            if (response.ok) {
                const { added } = await response.json();
                const updatedTweets = tweets.map((t) => {
                    if (t.id === tweet.id) {
                        if (type === 'like') {
                            return {
                                ...t,
                                liked: added,
                                likes: added ? t.likes + 1 : t.likes - 1,
                            };
                        } else {
                            return {
                                ...t,
                                retweeted: added,
                                retweets: added
                                    ? t.retweets + 1
                                    : t.retweets - 1,
                            };
                        }
                    }
                    return t;
                });
                setTweets(updatedTweets);
            }
        } catch (error) {
            console.error('Error updating tweet:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <AuthForm onAuth={login} />;
    }

    return (
        <div className="flex min-h-screen bg-black">
            <Sidebar user={user!} onLogout={logout} token={token!} />
            <main className="flex-1 max-w-2xl border-x border-gray-800">
                <div className="sticky top-0 bg-black/80 backdrop-blur-md border-b border-gray-800 p-4">
                    <h1 className="text-xl font-bold">Home</h1>
                </div>
                <TweetComposer onTweet={addTweet} />
                <TweetFeed
                    tweets={tweets}
                    onUpdateTweet={updateTweet}
                    loading={loadingTweets}
                />
            </main>
            <div className="w-80 p-4">
                <div className="bg-gray-900 rounded-2xl p-4">
                    <h2 className="text-xl font-bold mb-3">What's happening</h2>
                    <div className="space-y-3">
                        <div className="hover:bg-gray-800 p-2 rounded cursor-pointer">
                            <p className="text-gray-500 text-sm">
                                Trending in Technology
                            </p>
                            <p className="font-bold">Next.js</p>
                            <p className="text-gray-500 text-sm">
                                42.1K Tweets
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
