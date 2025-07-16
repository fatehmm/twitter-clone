import { NextRequest, NextResponse } from 'next/server';
import { toggleTweetInteraction } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        const { type } = await request.json();
        const tweetId = parseInt(params.id);

        if (!type || !['like', 'retweet'].includes(type)) {
            return NextResponse.json(
                { error: 'Invalid interaction type' },
                { status: 400 }
            );
        }

        const result = await toggleTweetInteraction(
            tweetId,
            decoded.userId,
            type
        );

        return NextResponse.json({ success: true, added: result });
    } catch (error) {
        console.error('Tweet interaction error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
