'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Briefcase, Building2, ArrowRight } from 'lucide-react';
import { getJobs, getCompanies } from '@/lib/services/api';
import { useRouter } from 'next/navigation';
import type { Job } from '@/types/job';
import type { Company } from '@/types/company';

type Result =
  | { type: 'job'; id: string; title: string; company: string }
  | { type: 'company'; id: string; name: string; tagline: string };

export function SearchCommand() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const router = useRouter();

  // Fetch jobs and companies
  useEffect(() => {
    getJobs().then(res => setJobs(res.jobs)).catch(console.error);
    getCompanies().then(res => setCompanies(res.companies)).catch(console.error);
  }, []);

  // Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const q = query.toLowerCase().trim();
  const results: Result[] = q
    ? [
      ...jobs.filter(
        j => j.title.toLowerCase().includes(q) || j.company?.name.toLowerCase().includes(q)
      )
        .slice(0, 4)
        .map(j => ({ type: 'job' as const, id: String(j.id), title: j.title, company: j.company?.name || '' })),
      ...companies.filter(
        c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q)
      )
        .slice(0, 3)
        .map(c => ({ type: 'company' as const, id: String(c.id), name: c.name, tagline: c.tagline })),
    ]
    : [];

  const navigate = (result: Result) => {
    setOpen(false);
    setQuery('');
    if (result.type === 'job') router.push(`/jobs/${result.id}`);
    else router.push(`/companies/${result.id}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          {/* Modal */}
          <motion.div
            className="fixed top-[15%] left-1/2 z-50 w-full max-w-xl -translate-x-1/2"
            initial={{ opacity: 0, y: -16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <div className="bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-hover)] overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
                <Search className="w-4 h-4 text-[var(--ink-3)] shrink-0" />
                <input
                  autoFocus
                  id="search-command-input"
                  type="text"
                  placeholder="Search jobs, companies..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  // NOTE: React controlled input - XSS safe via framework-native escaping
                  className="flex-1 bg-transparent text-[var(--ink)] placeholder:text-[var(--ink-4)] text-sm outline-none"
                />
                <kbd className="text-[10px] font-mono text-[var(--ink-4)] border border-[var(--border)] rounded px-1.5 py-0.5">ESC</kbd>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="py-2 max-h-80 overflow-y-auto">
                  {results.map(r => (
                    <button
                      key={r.type + r.id}
                      onClick={() => navigate(r)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--teal-light)] text-left transition-colors group"
                    >
                      <div className="w-6 h-6 flex items-center justify-center text-[var(--ink-3)] group-hover:text-[var(--teal)] transition-colors">
                        {r.type === 'job' ? <Briefcase className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--ink)] truncate">
                          {r.type === 'job' ? r.title : r.name}
                        </p>
                        <p className="text-xs text-[var(--ink-3)] truncate">
                          {r.type === 'job' ? r.company : r.tagline}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--ink-4)] group-hover:text-[var(--teal)] opacity-0 group-hover:opacity-100 transition-all" />
                    </button>
                  ))}
                </div>
              )}

              {q && results.length === 0 && (
                <div className="px-4 py-8 text-center text-sm text-[var(--ink-3)]">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {!q && (
                <div className="px-4 py-8 text-center text-sm text-[var(--ink-4)]">
                  Type to search jobs and companies
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
