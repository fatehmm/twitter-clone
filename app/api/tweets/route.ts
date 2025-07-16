import { NextRequest, NextResponse } from 'next/server';
import { createTweet, getTweets } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const token = request.headers
            .get('authorization')
            ?.replace('Bearer ', '');
        let userId: number | undefined;

        if (token) {
            const decoded = verifyToken(token);
            userId = decoded?.userId;
        }

        const tweets = await getTweets(userId);
        return NextResponse.json(tweets);
    } catch (error) {
        console.error('Get tweets error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

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

        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json(
                { error: 'Tweet content is required' },
                { status: 400 }
            );
        }

        if (content.length > 280) {
            return NextResponse.json(
                { error: 'Tweet must be 280 characters or less' },
                { status: 400 }
            );
        }

        const tweet = await createTweet(content.trim(), decoded.userId);

        if (!tweet) {
            return NextResponse.json(
                { error: 'Failed to create tweet' },
                { status: 500 }
            );
        }

        return NextResponse.json(tweet);
    } catch (error) {
        console.error('Create tweet error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
