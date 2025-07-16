import { createClient } from '@libsql/client';
import bcrypt from 'bcryptjs';

const db = createClient({
    url: 'libsql://twitter-clone-fatehmm.aws-eu-west-1.turso.io',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize database tables
export async function initDatabase() {
    try {
        // Users table
        await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        profile_image TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Add profile_image column if it doesn't exist (for existing databases)
        try {
            await db.execute(`ALTER TABLE users ADD COLUMN profile_image TEXT`);
        } catch (error) {
            // Column already exists, ignore error
        }

        // Tweets table
        await db.execute(`
      CREATE TABLE IF NOT EXISTS tweets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        likes INTEGER DEFAULT 0,
        retweets INTEGER DEFAULT 0,
        replies INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

        // Tweet interactions table
        await db.execute(`
      CREATE TABLE IF NOT EXISTS tweet_interactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tweet_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('like', 'retweet')),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tweet_id, user_id, type),
        FOREIGN KEY (tweet_id) REFERENCES tweets (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
      )
    `);

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Database initialization error:', error);
    }
}

export interface User {
    id: number;
    username: string;
    password?: string;
    profile_image?: string;
    created_at: string;
}

export interface Tweet {
    id: number;
    content: string;
    user_id: number;
    username: string;
    likes: number;
    retweets: number;
    replies: number;
    created_at: string;
    liked?: boolean;
    retweeted?: boolean;
}

// User functions
export async function createUser(
    username: string,
    password: string
): Promise<User | null> {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.execute({
            sql: 'INSERT INTO users (username, password) VALUES (?, ?)',
            args: [username, hashedPassword],
        });

        const userResult = await db.execute({
            sql: 'SELECT id, username, profile_image, created_at FROM users WHERE id = ?',
            args: [Number(result.lastInsertRowid)],
        });

        return userResult.rows[0] as unknown as User;
    } catch (error) {
        console.error('Create user error:', error);
        return null;
    }
}

export async function authenticateUser(
    username: string,
    password: string
): Promise<User | null> {
    try {
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE username = ?',
            args: [username],
        });

        const user = result.rows[0] as unknown as User & { password: string };
        if (!user) return null;

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error('Authentication error:', error);
        return null;
    }
}

export async function getUserById(id: number): Promise<User | null> {
    try {
        const result = await db.execute({
            sql: 'SELECT id, username, profile_image, created_at FROM users WHERE id = ?',
            args: [id],
        });
        return result.rows[0] as unknown as User;
    } catch (error) {
        console.error('Get user error:', error);
        return null;
    }
}

// Tweet functions
export async function createTweet(
    content: string,
    userId: number
): Promise<Tweet | null> {
    try {
        const result = await db.execute({
            sql: 'INSERT INTO tweets (content, user_id) VALUES (?, ?)',
            args: [content, userId],
        });

        const tweetResult = await db.execute({
            sql: `SELECT t.*, u.username, u.profile_image
            FROM tweets t 
            JOIN users u ON t.user_id = u.id 
            WHERE t.id = ?`,
            args: [Number(result.lastInsertRowid)],
        });

        return tweetResult.rows[0] as unknown as Tweet;
    } catch (error) {
        console.error('Create tweet error:', error);
        return null;
    }
}

export async function getTweets(userId?: number): Promise<Tweet[]> {
    try {
        const result = await db.execute({
            sql: `SELECT 
              t.*,
              u.username,
              u.profile_image,
              CASE WHEN li.user_id IS NOT NULL THEN 1 ELSE 0 END as liked,
              CASE WHEN rt.user_id IS NOT NULL THEN 1 ELSE 0 END as retweeted
            FROM tweets t
            JOIN users u ON t.user_id = u.id
            LEFT JOIN tweet_interactions li ON t.id = li.tweet_id AND li.user_id = ? AND li.type = 'like'
            LEFT JOIN tweet_interactions rt ON t.id = rt.tweet_id AND rt.user_id = ? AND rt.type = 'retweet'
            ORDER BY t.created_at DESC`,
            args: [userId || null, userId || null],
        });

        return result.rows as unknown as Tweet[];
    } catch (error) {
        console.error('Get tweets error:', error);
        return [];
    }
}

export async function toggleTweetInteraction(
    tweetId: number,
    userId: number,
    type: 'like' | 'retweet'
): Promise<boolean> {
    try {
        // Check if interaction exists
        const existingResult = await db.execute({
            sql: 'SELECT * FROM tweet_interactions WHERE tweet_id = ? AND user_id = ? AND type = ?',
            args: [tweetId, userId, type],
        });

        const existing = existingResult.rows[0];

        if (existing) {
            // Remove interaction
            await db.execute({
                sql: 'DELETE FROM tweet_interactions WHERE tweet_id = ? AND user_id = ? AND type = ?',
                args: [tweetId, userId, type],
            });

            // Decrement counter
            const column = type === 'like' ? 'likes' : 'retweets';
            await db.execute({
                sql: `UPDATE tweets SET ${column} = ${column} - 1 WHERE id = ?`,
                args: [tweetId],
            });

            return false;
        } else {
            // Add interaction
            await db.execute({
                sql: 'INSERT INTO tweet_interactions (tweet_id, user_id, type) VALUES (?, ?, ?)',
                args: [tweetId, userId, type],
            });

            // Increment counter
            const column = type === 'like' ? 'likes' : 'retweets';
            await db.execute({
                sql: `UPDATE tweets SET ${column} = ${column} + 1 WHERE id = ?`,
                args: [tweetId],
            });

            return true;
        }
    } catch (error) {
        console.error('Toggle interaction error:', error);
        return false;
    }
}

// Initialize database on import
initDatabase();

export async function updateUserProfileImage(
    userId: number,
    profileImage: string
): Promise<boolean> {
    try {
        await db.execute({
            sql: 'UPDATE users SET profile_image = ? WHERE id = ?',
            args: [profileImage, userId],
        });
        return true;
    } catch (error) {
        console.error('Update profile image error:', error);
        return false;
    }
}
