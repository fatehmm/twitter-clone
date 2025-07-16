'use client';

import {
    HomeIcon,
    SearchIcon,
    BellIcon,
    MailIcon,
    BookmarkIcon,
    UserIcon,
    DotsIcon,
} from './Icons';

interface User {
    id: number;
    username: string;
}

interface SidebarProps {
    user: User;
    onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
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
        <div className="w-64 p-4 flex flex-col h-screen">
            <div className="mb-8">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                </div>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2">
                    {menuItems.map((item, index) => (
                        <li key={index}>
                            <button
                                className={`flex items-center space-x-4 p-3 rounded-full hover:bg-gray-900 transition-colors w-full text-left ${
                                    item.active ? 'font-bold' : ''
                                }`}
                            >
                                <item.icon />
                                <span className="text-xl">{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>

                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full mt-6 w-full">
                    Tweet
                </button>
            </nav>

            <div className="mt-auto">
                <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-gray-900 cursor-pointer group">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                            {user.username[0].toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <p className="font-bold">{user.username}</p>
                        <p className="text-gray-500 text-sm">
                            @{user.username}
                        </p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={onLogout}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300 text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
