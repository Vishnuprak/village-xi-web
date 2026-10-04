import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { QueryProvider } from '@/lib/query-provider';
import { Navbar } from '@/components/ui/Navbar';
import { MobileNav } from '@/components/ui/MobileNav';

export const metadata: Metadata = {
  title: 'VILLAGE XI — Live Cricket Platform',
  description: 'Real-time village cricket live scoring, scoreboard, fixtures, and scorecards platform.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased pb-20 md:pb-8 selection:bg-emerald-500 selection:text-slate-950">
        <QueryProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-[calc(100vh-4rem)]">{children}</main>
            <MobileNav />
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
