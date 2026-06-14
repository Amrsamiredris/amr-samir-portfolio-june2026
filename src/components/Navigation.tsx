'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Briefcase, Home } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cv', label: 'CV', icon: FileText },
    { href: '/portfolio', label: 'Portfolio', icon: Briefcase },
  ];

  return (
    <header className="sticky top-0 z-50 flex justify-center w-full px-4 pt-6 pb-2">
      <nav className="flex items-center gap-1 md:gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-zinc-950/60 backdrop-blur-lg border border-zinc-800/80 rounded-full shadow-2xl shadow-zinc-950/50">
        {links.map((link) => {
          const isActive = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium transition-colors duration-200 ${
                isActive ? 'text-zinc-100' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-nav-glow"
                  className="absolute inset-0 bg-zinc-900 border border-zinc-800/60 rounded-full -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-violet-400' : 'text-zinc-400'}`} />
              <span>{link.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-violet-400 animate-pulse absolute bottom-1 left-1/2 -translate-x-1/2 hidden md:block" />
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
