'use client';

import { useState } from 'react';

interface AuthFormProps {
    onAuth: (user: { id: number; username: string }, token: string) => void;
}

export default function AuthForm({ onAuth }: AuthFormProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            onAuth(data.user, data.token);
        } catch (error) {
            setError(
                error instanceof Error ? error.message : 'Authentication failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">
                        {isLogin ? 'Sign in to Twitter' : 'Join Twitter today'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                        {loading
                            ? 'Please wait...'
                            : isLogin
                            ? 'Sign in'
                            : 'Sign up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 hover:text-blue-300"
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Sign in'}
                    </button>
                </div>
            </div>
        </div>
    );
}
