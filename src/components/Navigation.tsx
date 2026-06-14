'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/cv', label: 'CV' },
    { href: '/portfolio', label: 'Portfolio' },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Framer Motion variants for mobile menu stagger
  const menuVariants = {
    closed: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const linkVariants = {
    closed: { y: 12, opacity: 0 },
    open: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[var(--glass)] border-b border-[var(--border)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Left: Monogram Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center font-extrabold text-sm tracking-tight shadow-md shadow-blue-500/10 group-hover:scale-105 active:scale-98 transition-all">
            ASE
          </div>
          <span className="hidden sm:inline-block font-bold text-sm tracking-tight hover:text-[var(--accent)] transition-colors">
            Amr Samir Edris
          </span>
        </Link>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 bg-[var(--bg-secondary)]/50 border border-[var(--border)] p-1 rounded-full">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="relative px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-300 outline-none"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-glow"
                    className="absolute inset-0 bg-[var(--bg-primary)] border border-[var(--border)] rounded-full -z-10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={isActive ? 'text-[var(--accent)] font-bold' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Theme Toggle & Hamburger Button */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="w-10 h-10 rounded-xl bg-[var(--glass)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] transition-all active:scale-95 outline-none cursor-pointer"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-zinc-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {/* Hamburger Menu (Mobile) */}
          <button
            onClick={toggleMobileMenu}
            aria-label="Toggle Navigation Menu"
            className="md:hidden w-10 h-10 rounded-xl bg-[var(--glass)] hover:bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-center text-[var(--text-primary)] transition-all outline-none cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop filter overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMobileMenu}
              className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-30 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-16 left-0 right-0 bg-[var(--bg-primary)] border-b border-[var(--border)] shadow-2xl p-6 z-40 md:hidden flex flex-col gap-4 overflow-hidden origin-top"
            >
              <div className="flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.div key={link.href} variants={linkVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-all ${
                          isActive
                            ? 'bg-blue-500/10 text-[var(--accent)] border border-blue-500/20'
                            : 'text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] border border-transparent'
                        }`}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
