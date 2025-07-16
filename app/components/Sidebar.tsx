'use client';

import { useState } from 'react';
import {
    BellIcon,
    BookmarkIcon,
    DotsIcon,
    HomeIcon,
    MailIcon,
    SearchIcon,
    UserIcon,
} from './Icons';
import ProfileImageUpload from './ProfileImageUpload';

interface User {
    id: number;
    username: string;
    profile_image?: string;
}

interface SidebarProps {
    user: User;
    onLogout: () => void;
    token: string;
}

export default function Sidebar({ user, onLogout, token }: SidebarProps) {
    const [currentUser, setCurrentUser] = useState(user);

    const handleImageUpdate = (imageUrl: string) => {
        setCurrentUser({ ...currentUser, profile_image: imageUrl });
    };

    const menuItems = [
        { icon: HomeIcon, label: 'Home', active: true },
        { icon: SearchIcon, label: 'Explore' },
        { icon: BellIcon, label: 'Notifications' },
        { icon: MailIcon, label: 'Messages' },
        { icon: BookmarkIcon, label: 'Bookmarks' },
        { icon: UserIcon, label: 'Profile' },
        { icon: DotsIcon, label: 'More' },
    ];

    return (
        <>
            {/* Desktop/Tablet Sidebar */}
            <div className="hidden sm:flex w-16 md:w-64 p-2 md:p-4 flex-col h-screen border-r border-gray-800">
                <div className="mb-8">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                    </div>
                </div>
                <nav className="flex-1">
                    <ul className="space-y-2">
                        {menuItems.map((item, index) => (
                            <li key={item.label}>
                                <button
                                    type="button"
                                    className={`flex items-center space-x-4 p-3 rounded-full hover:bg-gray-900 transition-colors w-full text-left ${
                                        item.active ? 'font-bold' : ''
                                    }`}
                                >
                                    <item.icon />
                                    <span className="text-xl hidden md:block">
                                        {item.label}
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-3 md:px-8 rounded-full mt-6 w-full"
                    >
                        <span className="hidden md:block">Tweet</span>
                        <span className="md:hidden">+</span>
                    </button>
                </nav>
                <div className="mt-auto">
                    <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 cursor-pointer group">
                        <ProfileImageUpload
                            currentImage={currentUser.profile_image}
                            onImageUpdate={handleImageUpdate}
                            token={token}
                        />
                        <div className="flex-1 hidden md:block">
                            <p className="font-bold">{currentUser.username}</p>
                            <p className="text-gray-500 text-sm">
                                @{currentUser.username}
                            </p>
                        </div>
                        <div className="relative hidden md:block">
                            <button
                                type="button"
                                onClick={onLogout}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Mobile Bottom Nav */}
            <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 flex justify-between items-center px-2 py-1">
                {menuItems.slice(0, 5).map((item) => (
                    <button
                        key={item.label}
                        type="button"
                        className={`flex flex-col items-center flex-1 py-2 ${
                            item.active ? 'text-blue-500' : 'text-gray-400'
                        }`}
                    >
                        <item.icon />
                        <span className="text-xs mt-1">{item.label}</span>
                    </button>
                ))}
                <div className="flex flex-col items-center flex-1 py-2">
                    <ProfileImageUpload
                        currentImage={currentUser.profile_image}
                        onImageUpdate={handleImageUpdate}
                        token={token}
                    />
                    <button
                        type="button"
                        onClick={onLogout}
                        className="text-xs text-red-400 mt-1"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </>
    );
}
