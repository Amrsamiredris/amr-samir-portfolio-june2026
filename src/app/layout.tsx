import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';
import { ThemeProvider } from '@/components/ThemeProvider';
import Script from 'next/script';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Amr Samir Edris',
  description: 'Senior Account Manager | Mega Events & Large-Scale Productions',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_ID;

  return (
    <html lang="en" className="h-full">
      <head>
        {clarityId && (
          <Script id="microsoft-clarity" strategy="afterInteractive">
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
        className={`${inter.variable} antialiased min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col`}
      >
        <ThemeProvider>
          <Navigation />
          <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
            {children}
          </main>
          <footer className="w-full text-center py-8 text-xs text-[var(--text-secondary)] border-t border-[var(--border)] mt-auto bg-[var(--bg-secondary)]/30">
            <p>© {new Date().getFullYear()} Amr Samir Edris. All rights reserved.</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
