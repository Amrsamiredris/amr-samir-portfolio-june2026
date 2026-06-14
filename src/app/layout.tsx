import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import Script from 'next/script';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Amr Samir Edris — Portfolio',
  description: 'Premium personal portfolio and analytics tracking dashboard for Amr Samir Edris, Senior Account Manager specializing in Mega Events & Large-Scale Productions.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" className="h-full dark">
      <head>
        {/* 
          MICROSOFT CLARITY TRACKING PIXEL
          Conditionally injected only if NEXT_PUBLIC_CLARITY_ID is set.
        */}
        {clarityId && (
          <Script id="microsoft-clarity-pixel" strategy="afterInteractive">
            {`
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}
          </Script>
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-violet-500/30 selection:text-violet-200`}
      >
        <Navigation />
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          {children}
        </main>
        <footer className="w-full text-center py-8 text-xs text-zinc-600 border-t border-zinc-900 mt-auto">
          <p>© {new Date().getFullYear()} Amr Samir. Built with Next.js & Framer Motion.</p>
        </footer>
      </body>
    </html>
  );
}
