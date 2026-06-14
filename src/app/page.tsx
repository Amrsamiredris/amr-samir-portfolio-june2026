'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, FileText, Briefcase, ArrowUpRight, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

const titles = ['Project Manager', 'Marketing Strategist', 'AI & Tech Consultant'];

const LOGOS = [
  'DCT Abu Dhabi',
  'DET Dubai',
  'Expo 2020',
  'Formula 1',
  'EA Sports',
  'Sony',
  'McCann'
];

export default function Home() {
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const email = 'amrsamiredris@gmail.com';
  const phone = '+971 54 219 1028';
  const linkedin = 'linkedin.com/in/amrsamiredris';

  // Dynamic Typography Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  // Track Home page visits
  useEffect(() => {
    trackEvent('home_visits');
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-10 md:py-16">
      {/* Contact Card Container */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-xl bg-zinc-900/30 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-6 md:p-10 shadow-2xl shadow-zinc-950/80 flex flex-col items-center text-center relative overflow-hidden"
      >
        {/* Ambient Glow effect inside the card */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-violet-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Pulsing Available Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/40 border border-zinc-800 rounded-full text-[10px] md:text-xs text-zinc-400 font-medium mb-6 md:mb-8 hover:border-zinc-700 transition-colors">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Available for select Q3 2026 Strategy Advisory
        </div>

        {/* User Image Profile Silhouette */}
        <div className="w-20 h-20 rounded-full border border-zinc-800 bg-zinc-900/80 flex items-center justify-center text-2xl font-bold text-zinc-300 shadow-inner mb-6">
          ASE
        </div>

        {/* Amr Samir Edris Name Header */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-100 mb-1">
          Amr Samir Edris
        </h1>

        {/* Title/Subtitle designation */}
        <h2 className="text-xs font-semibold text-zinc-400 max-w-xs mb-3">
          Senior Account Manager | Mega Events & Large-Scale Productions
        </h2>

        {/* Framer Motion Title Rotator */}
        <div className="h-8 flex items-center justify-center mb-6 overflow-hidden relative w-full">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute text-violet-400 text-sm md:text-base font-semibold tracking-wide"
            >
              {titles[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Contact info list items */}
        <div className="flex flex-col gap-2 w-full max-w-xs border-y border-zinc-850/60 py-4 mb-8 text-xs text-zinc-400 text-left">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-zinc-550 shrink-0" />
            <span className="font-mono">{email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-zinc-550 shrink-0" />
            <span className="font-mono">{phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-zinc-550 shrink-0 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
            <a
              href={`https://${linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-violet-400 transition-colors font-mono"
            >
              {linkedin}
            </a>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center items-center">
          {/* Copy Email Button */}
          <button
            onClick={handleCopyEmail}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium border border-zinc-800/80 hover:border-zinc-700/80 bg-zinc-950/50 hover:bg-zinc-900/60 transition-all duration-300 text-zinc-300 active:scale-98 min-w-[140px]"
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5 text-emerald-400"
                >
                  <Check className="w-4 h-4" />
                  Copied!
                </motion.span>
              ) : (
                <motion.span
                  key="copy"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  Copy Email
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* CV CTA */}
          <Link
            href="/cv"
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium border border-zinc-800/80 bg-zinc-950/50 hover:border-violet-500/30 hover:bg-violet-950/10 hover:text-violet-400 transition-all duration-300 text-zinc-300"
          >
            <FileText className="w-4 h-4" />
            <span>Read CV</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>

          {/* Portfolio CTA */}
          <Link
            href="/portfolio"
            className="flex items-center justify-center gap-1.5 w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs md:text-sm font-medium border border-zinc-800/80 bg-zinc-950/50 hover:border-violet-500/30 hover:bg-violet-950/10 hover:text-violet-400 transition-all duration-300 text-zinc-300"
          >
            <Briefcase className="w-4 h-4" />
            <span>Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </Link>
        </div>
      </motion.div>

      {/* Bento Grid Highlights */}
      <div className="w-full max-w-xl mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Box 1 (Impact Metric) */}
        <div className="bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between min-h-[140px] text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Project Leadership</span>
          <div>
            <h3 className="text-3xl font-extrabold text-zinc-100 mt-2">$10M+</h3>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Budget Managed &bull; Global multi-industry campaign cycles
            </p>
          </div>
        </div>

        {/* Box 2 (Operator Stack) */}
        <div className="bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between min-h-[140px] text-left">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Operator Stack</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              'Next.js', 
              'OpenAI API', 
              'Run-of-Show Design', 
              'Budgeting & BOQs', 
              'Stakeholder Alignment', 
              'CRM Systems'
            ].map((tech) => (
              <span key={tech} className="px-2 py-0.5 bg-zinc-950 border border-zinc-850 rounded text-[9px] text-zinc-300 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Box 3 (Case Study Teaser) */}
        <Link
          href="/portfolio"
          className="sm:col-span-2 bg-zinc-900/20 backdrop-blur-sm border border-zinc-800 hover:border-violet-500/30 rounded-2xl p-6 flex items-center justify-between group transition-all duration-300 min-h-[80px]"
        >
          <div className="text-left max-w-[85%]">
            <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Case Study Highlight</span>
            <h4 className="text-xs md:text-sm font-semibold text-zinc-200 group-hover:text-violet-400 transition-colors mt-0.5 leading-relaxed">
              DEF GameExpo 2026 &mdash; Reached 30,000+ physical attendees and 500,000+ online viewers in partnership with DET/Visit Dubai. Click to view full portfolio.
            </h4>
          </div>
          <div className="p-2 bg-zinc-950 border border-zinc-850 group-hover:border-violet-500/20 rounded-xl transition-all duration-300 shrink-0">
            <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-violet-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </Link>
      </div>

      {/* Infinite Logo Ticker Section */}
      <div className="w-full max-w-4xl mt-20 md:mt-24 px-4 overflow-hidden relative">
        {/* Soft edge masking for smooth fade-in and fade-out at borders */}
        <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-zinc-600 mb-6 font-semibold">
          Powering ecosystems at leading networks
        </p>

        {/* Marquee viewport */}
        <div className="flex w-full overflow-hidden py-4 border-y border-zinc-900/60">
          <div className="animate-marquee flex gap-12 items-center">
            {/* Set 1 */}
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-1-${idx}`}
                className="bg-zinc-900/40 border border-zinc-800 text-zinc-450 font-medium px-4 py-2 rounded-md mx-2 uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-default"
              >
                {logo}
              </div>
            ))}
            {/* Set 2 (for seamless looping wrapper) */}
            {LOGOS.map((logo, idx) => (
              <div
                key={`logo-2-${idx}`}
                className="bg-zinc-900/40 border border-zinc-800 text-zinc-450 font-medium px-4 py-2 rounded-md mx-2 uppercase tracking-wider text-[10px] md:text-xs whitespace-nowrap hover:text-zinc-200 hover:border-zinc-700 transition-all cursor-default"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
