import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/database';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, password } = await request.json();

        if (!username || !password) {
            return NextResponse.json(
                { error: 'Username and password are required' },
                { status: 400 }
            );
        }

        if (username.length < 3) {
            return NextResponse.json(
                { error: 'Username must be at least 3 characters long' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        const user = await createUser(username, password);

        if (!user) {
            return NextResponse.json(
                { error: 'Username already exists' },
                { status: 409 }
            );
        }

        const token = generateToken(user);

        return NextResponse.json({
            user: { id: user.id, username: user.username },
            token,
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
