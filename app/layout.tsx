import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MangoOS — Restaurant Management Platform',
  description:
    'MangoOS — a premium restaurant business management platform for The Mango Resort, Nepal.',
  openGraph: {
    title: 'MangoOS — Restaurant Management Platform',
    description:
      'A premium restaurant business management platform for The Mango Resort, Nepal.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans">{children}</body>
    </html>
  );
}
