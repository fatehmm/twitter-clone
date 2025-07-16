'use client';

import { useRef, useState } from 'react';
import { ImageIcon } from './Icons';

interface ProfileImageUploadProps {
    currentImage?: string;
    onImageUpdate: (imageUrl: string) => void;
    token: string;
}

export default function ProfileImageUpload({
    currentImage,
    onImageUpdate,
    token,
}: ProfileImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/user/profile-image', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                onImageUpdate(data.profileImage);
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to upload image');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative group">
            <button
                type="button"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden cursor-pointer group-hover:opacity-80 transition-opacity border border-gray-500 bg-gray-700"
                onClick={() => fileInputRef.current?.click()}
                tabIndex={0}
                aria-label="Upload profile image"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                        fileInputRef.current?.click();
                }}
            >
                {currentImage ? (
                    <img
                        src={currentImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon />
                    </div>
                )}
            </button>
            {uploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
