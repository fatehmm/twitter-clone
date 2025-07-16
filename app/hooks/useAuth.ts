'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface User {
    id: number;
    username: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedToken = Cookies.get('auth_token');
        const savedUser = Cookies.get('auth_user');

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Error parsing saved user:', error);
                Cookies.remove('auth_token');
                Cookies.remove('auth_user');
            }
        }

        setLoading(false);
    }, []);

    const login = (userData: User, authToken: string) => {
        setUser(userData);
        setToken(authToken);
        Cookies.set('auth_token', authToken, { expires: 7 });
        Cookies.set('auth_user', JSON.stringify(userData), { expires: 7 });
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove('auth_token');
        Cookies.remove('auth_user');
    };

    return {
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!user && !!token,
    };
}
