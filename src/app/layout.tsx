import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/frontend/components/AuthProvider';
import { Navbar } from '@/frontend/components/Navbar';
import { Footer } from '@/frontend/components/Footer';
import { ToastContainer } from '@/frontend/components/ui/Toast';

export const metadata: Metadata = {
  title: {
    default: 'AMCFOSS PYQ — Amrita Chennai Previous Year Papers',
    template: '%s | AMCFOSS PYQ',
  },
  description:
    'Free, community-driven repository of previous year question papers for Amrita Chennai students. Search, upload, and download papers by subject code.',
  keywords: ['Amrita Chennai', 'PYQ', 'previous year questions', 'exam papers', 'AMCFOSS'],
  openGraph: {
    title: 'AMCFOSS PYQ',
    description: 'Community-driven PYQ repository for Amrita Chennai',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <Navbar />
          <main style={{ minHeight: 'calc(100vh - 64px)' }}>{children}</main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}
