'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Download, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { usePageTimer } from '@/hooks/usePageTimer';
import { trackEvent } from '@/lib/analytics';
import { motion } from 'framer-motion';

export default function CVPage() {
  // Activate time-on-page telemetry tracking
  usePageTimer('cv');

  const [iframeError, setIframeError] = useState(false);
  const [checking, setChecking] = useState(true);

  // Track initial page view event and verify if PDF exists
  useEffect(() => {
    trackEvent('cv_views');

    async function checkPdfExists() {
      try {
        const res = await fetch('/cv.pdf', { method: 'HEAD' });
        if (!res.ok) {
          setIframeError(true);
        }
      } catch {
        setIframeError(true);
      } finally {
        setChecking(false);
      }
    }

    checkPdfExists();
  }, []);

  const handleDownloadClick = () => {
    trackEvent('cv_downloads');
  };

  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors mb-2 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Home
          </Link>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100">
            Curriculum Vitae
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm mt-1">
            Review professional credentials, timelines, and specialized capabilities.
          </p>
        </div>

        {/* Download Call-to-Action */}
        <a
          href="/cv.pdf"
          download="Amr_Samir_Edris_CV.pdf"
          onClick={handleDownloadClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-zinc-100 rounded-xl text-xs md:text-sm font-semibold transition-all duration-300 shadow-lg shadow-violet-950/20 active:scale-98"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      </div>

      {/* Interactive Frame Wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex-1 min-h-[600px] h-[75vh] w-full rounded-2xl border border-zinc-900 bg-zinc-950 overflow-hidden relative shadow-2xl flex flex-col"
      >
        {checking ? (
          <div className="flex-1 flex items-center justify-center bg-zinc-950">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
              <p className="text-xs text-zinc-650 font-medium">Verifying assets...</p>
            </div>
          </div>
        ) : iframeError ? (
          <div className="flex-1 flex items-center justify-center text-center p-8 bg-zinc-900/10 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 max-w-sm">
              <div className="p-3 bg-zinc-950/80 border border-zinc-850 rounded-full">
                <AlertCircle className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-zinc-200 font-bold text-base">Document Preview Initializing...</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                If the preview does not render automatically, please click the primary download button above to retrieve the file directly.
              </p>
            </div>
          </div>
        ) : (
          <iframe
            src="/cv.pdf#toolbar=0"
            className="w-full h-full border-none rounded-2xl flex-1"
            title="Amr Samir Edris CV Document"
          />
        )}
      </motion.div>
    </div>
  );
}
