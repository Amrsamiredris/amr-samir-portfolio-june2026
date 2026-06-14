'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, ChevronUp, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { trackEvent as logEvent } from '@/lib/analytics';

const titles = [
  'Project Manager',
  'Marketing Strategist',
  'AI & Tech Consultant',
  'Senior Account Manager',
  'Mega Events Specialist',
];

const LOGOS = [
  'DCT Abu Dhabi',
  'DET Dubai',
  'Expo 2020',
  'Formula 1',
  'Red Bull',
  'ESPN',
];

export default function Home() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const email = 'amrsamiredris@gmail.com';
  const phone = '+971 54 219 1028';
  const linkedin = 'linkedin.com/in/amrsamiredris';

  // Rotate subtitles
  useEffect(() => {
    const interval = setInterval(() => {
      setTitleIndex((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Track Home page visits
  useEffect(() => {
    logEvent('home_visits');
  }, []);

  // Scroll listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Contact Formspree submit handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');

    const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_ID || 'REPLACE_WITH_YOUR_ID';
    const formAction = `https://formspree.io/f/${formspreeId}`;

    try {
      const response = await fetch(formAction, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setFormState('error');
      }
    } catch (err) {
      console.error('Form submission failed:', err);
      setFormState('error');
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION */}
      <section className="w-full min-h-[100dvh] flex flex-col justify-center items-center py-20 px-4 text-center relative overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto flex flex-col items-center"
        >
          {/* Subtitle Rotator */}
          <div className="h-8 mb-4 flex items-center justify-center overflow-hidden relative w-full">
            <AnimatePresence mode="wait">
              <motion.span
                key={titleIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="absolute text-blue-500 font-bold text-xs md:text-sm tracking-[0.2em] uppercase"
              >
                {titles[titleIndex]}
              </motion.span>
            </AnimatePresence>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-none mb-6 text-[var(--text-primary)]">
            Amr Samir Edris
          </h1>

          {/* Subtitle paragraph */}
          <p className="text-base md:text-lg text-[var(--text-secondary)] max-w-xl mx-auto mb-8 leading-relaxed">
            Senior Account Manager specializing in Mega Events & Large-Scale Productions. Empowering brand ecosystems through structured execution.
          </p>

          {/* Contact Row */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-sm mb-12 text-[var(--text-secondary)]">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            >
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="font-mono">{email}</span>
            </a>
            <a
              href={`tel:${phone}`}
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            >
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="font-mono">{phone}</span>
            </a>
            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-500 transition-colors"
            >
              <svg className="w-4 h-4 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span className="font-mono">{linkedin}</span>
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
            <Link
              href="/cv"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-500/20 text-center active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              View CV
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-3.5 border border-blue-600/60 hover:border-blue-500 text-blue-500 hover:bg-blue-500/5 font-semibold rounded-xl text-sm transition-all text-center active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              View Portfolio
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 2. LOGO TICKER STRIP */}
      <section className="w-full bg-[var(--bg-secondary)]/30 border-y border-[var(--border)] py-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

        <div className="w-full overflow-hidden">
          <div className="ticker-track flex items-center gap-8">
            {/* Set 1 */}
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-1-${idx}`}
                className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md px-6 py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wider text-[var(--text-primary)] hover:border-blue-500/30 transition-all cursor-default"
              >
                {/* Replace text with <img> tags when /public/logos/ PNG files are added */}
                {logo}
              </div>
            ))}
            {/* Set 2 (for seamless loop) */}
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-2-${idx}`}
                className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md px-6 py-3 rounded-xl text-xs md:text-sm font-semibold tracking-wider text-[var(--text-primary)] hover:border-blue-500/30 transition-all cursor-default"
              >
                {/* Replace text with <img> tags when /public/logos/ PNG files are added */}
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHT CARDS */}
      <section className="w-full max-w-4xl py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Card 1 */}
          <div className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between min-h-[200px] hover:border-blue-500/25 transition-all">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">Project Operations</span>
            <div>
              <h3 className="text-5xl font-black tracking-tight text-[var(--text-primary)] mt-2">$10M+</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Budgets Managed. Structured end-to-end financial oversight and vendor procurement across multiple mega-scale project runs.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 flex flex-col justify-between min-h-[200px] hover:border-blue-500/25 transition-all">
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-blue-500">Global Execution</span>
            <div>
              <h3 className="text-5xl font-black tracking-tight text-[var(--text-primary)] mt-2">50+</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2 leading-relaxed">
                Events Delivered. Orchestrated global entertainment projects, sports tournaments, and live broadcast events with massive footfall.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 4. CONTACT FORM */}
      <section className="w-full max-w-lg py-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="bg-[var(--glass)] border border-[var(--border)] backdrop-blur-md rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight mb-2">
            Get in Touch
          </h2>
          <p className="text-xs text-[var(--text-secondary)] mb-6">
            Have an upcoming project or deployment? Submit details below to coordinate.
          </p>

          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Name"
                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                Message
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Write your message..."
                className="w-full px-4 py-2.5 bg-[var(--bg-primary)] border border-[var(--border)] hover:border-blue-500/30 focus:border-blue-500 focus:outline-none rounded-xl text-sm text-[var(--text-primary)] transition-all resize-none"
              />
            </div>

            {formState === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Thank you! Your message has been sent successfully.</span>
              </div>
            )}

            {formState === 'error' && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Submission failed. Please try again.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={formState === 'loading'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {formState === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </section>

      {/* 5. SCROLL TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full shadow-lg cursor-pointer outline-none active:scale-95 transition-all"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
