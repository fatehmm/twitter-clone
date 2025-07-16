import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfileImage } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const token = request.headers
            .get('authorization')
            ?.replace('Bearer ', '');

        if (!token) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        // Convert file to base64 for simple storage
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        const success = await updateUserProfileImage(decoded.userId, base64);

        if (!success) {
            return NextResponse.json(
                { error: 'Failed to update profile image' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            profileImage: base64,
        });
    } catch (error) {
        console.error('Profile image upload error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
