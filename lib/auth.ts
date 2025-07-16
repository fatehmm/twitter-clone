import jwt from 'jsonwebtoken';
import { User } from './database';

const JWT_SECRET =
    process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export function generateToken(user: User): string {
    return jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, {
        expiresIn: '7d',
    });
}

export function verifyToken(
    token: string
): { userId: number; username: string } | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: number;
            username: string;
        };
        return decoded;
    } catch (error) {
        return null;
    }
}

export interface AuthUser {
    id: number;
    username: string;
}
