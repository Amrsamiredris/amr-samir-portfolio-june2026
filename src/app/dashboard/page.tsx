'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Lock, KeyRound, AlertCircle, Eye, Download, Clock, BarChart3, Database, 
  RefreshCw, LogOut, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2 
} from 'lucide-react';
import { verifyPassword, checkAuth, logout } from './actions';
import { getLocalMetrics, supabase, AnalyticsData, formatDuration } from '@/lib/analytics';

export default function Dashboard() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<AnalyticsData | null>(null);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);
  const [simulationSuccess, setSimulationSuccess] = useState('');

  // Check initial authentication
  useEffect(() => {
    async function verifySession() {
      const isAuthed = await checkAuth();
      setAuthorized(isAuthed);
    }
    verifySession();
  }, []);

  // Fetch metrics once authorized
  useEffect(() => {
    if (authorized) {
      loadMetrics();
      setIsSupabaseActive(!!supabase);
    }
  }, [authorized]);

  const loadMetrics = async () => {
    if (supabase) {
      try {
        // Fetch metrics from Supabase table if it exists
        const { data, error } = await supabase.from('analytics_metrics').select('*');
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform array back to AnalyticsData object
          const dbMetrics: Partial<AnalyticsData> = {};
          data.forEach((row: { metric_name: string; value: number }) => {
            dbMetrics[row.metric_name as keyof AnalyticsData] = row.value;
          });
          
          // Merge with default seed if values are missing
          const fallback = getLocalMetrics();
          setMetrics({
            home_visits: dbMetrics.home_visits ?? fallback.home_visits,
            cv_views: dbMetrics.cv_views ?? fallback.cv_views,
            portfolio_views: dbMetrics.portfolio_views ?? fallback.portfolio_views,
            cv_downloads: dbMetrics.cv_downloads ?? fallback.cv_downloads,
            portfolio_downloads: dbMetrics.portfolio_downloads ?? fallback.portfolio_downloads,
            cv_duration_total: dbMetrics.cv_duration_total ?? fallback.cv_duration_total,
            cv_duration_count: dbMetrics.cv_duration_count ?? fallback.cv_duration_count,
            portfolio_duration_total: dbMetrics.portfolio_duration_total ?? fallback.portfolio_duration_total,
            portfolio_duration_count: dbMetrics.portfolio_duration_count ?? fallback.portfolio_duration_count,
          });
          return;
        }
      } catch (err) {
        console.warn('Could not fetch from Supabase, loading localStorage fallback instead:', err);
      }
    }
    // Fallback to local storage telemetry data
    setMetrics(getLocalMetrics());
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await verifyPassword(password);
      if (success) {
        setAuthorized(true);
      } else {
        setError('Access Denied. Invalid portfolio credentials.');
      }
    } catch {
      setError('An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setAuthorized(false);
    setPassword('');
  };

  const handleResetMetrics = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('portfolio_telemetry_metrics');
      loadMetrics();
      triggerSimulationAlert('Metrics reset to seed values.');
    }
  };

  const triggerSimulationAlert = (msg: string) => {
    setSimulationSuccess(msg);
    setTimeout(() => setSimulationSuccess(''), 3000);
  };

  const simulateEvent = (metric: keyof AnalyticsData, incrementBy = 1) => {
    if (!metrics) return;
    const updated = { ...metrics };
    updated[metric] += incrementBy;
    
    // Save to local storage for instant feedback
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio_telemetry_metrics', JSON.stringify(updated));
    }
    setMetrics(updated);
    triggerSimulationAlert(`Simulated +${incrementBy} to ${metric.replace('_', ' ')}!`);
  };

  // Calculate Conversions & Time Averages
  const cvViews = metrics?.cv_views || 1;
  const cvDownloads = metrics?.cv_downloads || 0;
  const cvConversion = Math.round((cvDownloads / cvViews) * 100);

  const portViews = metrics?.portfolio_views || 1;
  const portDownloads = metrics?.portfolio_downloads || 0;
  const portConversion = Math.round((portDownloads / portViews) * 100);

  const avgCvTime = metrics && metrics.cv_duration_count > 0 
    ? Math.round(metrics.cv_duration_total / metrics.cv_duration_count)
    : 0;

  const avgPortTime = metrics && metrics.portfolio_duration_count > 0 
    ? Math.round(metrics.portfolio_duration_total / metrics.portfolio_duration_count)
    : 0;

  // Show loading skeleton while checking session status
  if (authorized === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-violet-400 animate-spin" />
          <p className="text-sm text-zinc-500 font-medium">Authorizing secure bridge...</p>
        </div>
      </div>
    );
  }

  // --- PASSWORD LOCK SCREEN INTERFACE ---
  if (!authorized) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 md:py-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md bg-zinc-900/40 backdrop-blur-xl border border-zinc-900 rounded-2xl p-6 md:p-8 shadow-2xl relative"
        >
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-full">
              <Lock className="w-6 h-6 text-violet-400" />
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-center text-zinc-100 mb-2">
            Secure Portal
          </h2>
          <p className="text-zinc-500 text-xs md:text-sm text-center mb-6">
            Access restricted to verified administrators. Enter password.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                <KeyRound className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Access Password"
                className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-850 hover:border-zinc-800 focus:border-violet-500/50 rounded-xl text-sm text-zinc-100 placeholder:text-zinc-650 focus:outline-none transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/40 text-red-400 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:bg-violet-800 disabled:opacity-60 text-zinc-100 font-semibold rounded-xl text-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Unlock Analytics'
              )}
            </button>
          </form>

          {/* Secure Hint */}
          <div className="mt-8 pt-6 border-t border-zinc-900/60 text-center">
            <p className="text-[10px] text-zinc-600 leading-relaxed">
              * Note: If you have not set a custom <code className="text-zinc-500 bg-zinc-950 px-1 py-0.5 rounded font-mono">DASHBOARD_PASSWORD</code> in your environment config, use the default password <span className="font-semibold text-zinc-400">admin123</span>.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- BENTO GRID ANALYTICS DECK INTERFACE ---
  return (
    <div className="flex-1 flex flex-col gap-6">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-violet-400" />
            Analytics Deck
          </h1>
          <p className="text-zinc-555 text-xs md:text-sm mt-1">
            Real-time telemetry and user-interaction statistics summary.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Action */}
          <button
            onClick={loadMetrics}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-xs font-semibold hover:bg-zinc-850 hover:text-zinc-200 transition-colors text-zinc-400 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {/* Logout Action */}
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/10 border border-red-900/30 text-red-400 hover:bg-red-950/20 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Database Connection / Simulation Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-zinc-900/10 border border-zinc-900 rounded-xl">
        <div className="flex items-center gap-2">
          <Database className={`w-4 h-4 ${isSupabaseActive ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
          <span className="text-xs font-medium">
            Status:{' '}
            <span className={isSupabaseActive ? 'text-emerald-400' : 'text-amber-400'}>
              {isSupabaseActive ? 'Supabase Connected' : 'Simulating via Local Storage'}
            </span>
          </span>
        </div>

        {!isSupabaseActive && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetMetrics}
              className="text-[10px] text-zinc-500 hover:text-zinc-350 hover:underline font-semibold"
            >
              Reset to Seeds
            </button>
            <span className="text-zinc-800">|</span>
            <div className="flex gap-2">
              <button
                onClick={() => simulateEvent('home_visits', 12)}
                className="text-[10px] px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 rounded text-zinc-400"
              >
                +12 Visits
              </button>
              <button
                onClick={() => simulateEvent('cv_views', 1)}
                className="text-[10px] px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 rounded text-zinc-400"
              >
                +1 CV View
              </button>
              <button
                onClick={() => simulateEvent('portfolio_downloads', 1)}
                className="text-[10px] px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 rounded text-zinc-400"
              >
                +1 Portfolio Download
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Simulation Feedback Alert */}
      {simulationSuccess && (
        <div className="flex items-center gap-2 p-2 px-3 bg-emerald-950/20 border border-emerald-900/40 text-emerald-400 rounded-lg text-xs animate-fade-in w-max">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{simulationSuccess}</span>
        </div>
      )}

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Core Stat: Home Visits (Span 2) */}
        <div className="md:col-span-2 bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Global Traversal</span>
              <h3 className="text-lg font-bold text-zinc-200 mt-1">Total Visits</h3>
            </div>
            <span className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg">
              <Eye className="w-4 h-4 text-violet-400" />
            </span>
          </div>

          <div className="my-3">
            <span className="text-5xl font-black tracking-tight text-zinc-100">
              {metrics?.home_visits.toLocaleString() ?? '0'}
            </span>
            <span className="text-emerald-400 text-xs font-semibold ml-2 inline-flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>

          <p className="text-[11px] text-zinc-650 mt-1 font-light">
            Calculated across index entry loads and redirect callbacks.
          </p>
        </div>

        {/* Highlight Card: Conversion Ratio (Span 1) */}
        <div className="bg-gradient-to-br from-violet-950/20 to-zinc-950 border border-violet-900/20 rounded-2xl p-6 flex flex-col justify-between min-h-[180px]">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Conversion</span>
              <h3 className="text-lg font-bold text-zinc-200 mt-1">Interaction Rate</h3>
            </div>
            <Sparkles className="w-4 h-4 text-violet-400" />
          </div>

          <div className="my-3 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-zinc-100">{cvConversion}%</span>
            <span className="text-zinc-600 text-xs">CV downloads/views</span>
          </div>

          <div className="w-full bg-zinc-900/60 rounded-full h-1.5">
            <div 
              className="bg-violet-500 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${Math.min(100, cvConversion)}%` }} 
            />
          </div>

          <p className="text-[10px] text-zinc-500">
            Portfolio Rate is at <span className="text-zinc-350 font-medium">{portConversion}%</span>
          </p>
        </div>

        {/* CV Metrics Card */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-555">Timelines</span>
              <h3 className="text-base font-bold text-zinc-250 mt-1">CV Analytics</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-950/80 border border-zinc-850 rounded text-zinc-500">
              Page /cv
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">Total Views</span>
              <span className="text-sm font-semibold text-zinc-200">{metrics?.cv_views}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">PDF Downloads</span>
              <span className="text-sm font-semibold text-zinc-200">{metrics?.cv_downloads}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-zinc-400">Downloads Rate</span>
              <span className="text-sm font-semibold text-zinc-200">{cvConversion}%</span>
            </div>
          </div>
        </div>

        {/* Portfolio Metrics Card */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-555">Projects</span>
              <h3 className="text-base font-bold text-zinc-250 mt-1">Portfolio Analytics</h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 bg-zinc-950/80 border border-zinc-850 rounded text-zinc-500">
              Page /portfolio
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">Total Views</span>
              <span className="text-sm font-semibold text-zinc-200">{metrics?.portfolio_views}</span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">Deck Downloads</span>
              <span className="text-sm font-semibold text-zinc-200">{metrics?.portfolio_downloads}</span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-zinc-400">Downloads Rate</span>
              <span className="text-sm font-semibold text-zinc-200">{portConversion}%</span>
            </div>
          </div>
        </div>

        {/* Average Time engagement card */}
        <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-555">Engagement</span>
              <h3 className="text-base font-bold text-zinc-250 mt-1">Average Duration</h3>
            </div>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">CV Time-on-Page</span>
              <span className="text-sm font-semibold text-zinc-200 inline-flex items-center gap-1">
                {formatDuration(avgCvTime)}
                <span className="text-[10px] font-normal text-zinc-500">/view</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5 border-b border-zinc-900/60">
              <span className="text-xs text-zinc-400">Portfolio Time</span>
              <span className="text-sm font-semibold text-zinc-200 inline-flex items-center gap-1">
                {formatDuration(avgPortTime)}
                <span className="text-[10px] font-normal text-zinc-500">/view</span>
              </span>
            </div>
            <div className="flex justify-between items-center py-1.5">
              <span className="text-xs text-zinc-400">Combined Session Average</span>
              <span className="text-sm font-semibold text-zinc-200">
                {formatDuration(Math.round((avgCvTime + avgPortTime) / 2))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
