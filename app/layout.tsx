import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Twitter Clone',
    description: 'A simple Twitter clone built with Next.js',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-black text-white min-h-screen">{children}</body>
        </html>
    );
}
