'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Bookmark, Trash2, ExternalLink, MapPin, Calendar } from 'lucide-react';
import { useBookmarkStore } from '@/lib/store/bookmarks';
import { useJobs } from '@/lib/hooks/useJobs';
import { formatSalary, timeAgo, cn } from '@/lib/utils';

const STATUS_OPTIONS = ['Interested', 'Applied', 'Interviewing', 'Offer', 'Rejected'];

const STATUS_COLORS: Record<string, string> = {
  Interested: 'bg-sky-50 text-sky-700 border-sky-200',
  Applied: 'bg-amber-50 text-amber-700 border-amber-200',
  Interviewing: 'bg-purple-50 text-purple-700 border-purple-200',
  Offer: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function BookmarksPage() {
  const { bookmarked, statuses, savedDates, toggle, setStatus } = useBookmarkStore();

  const { data, isLoading } = useJobs({ limit: 100 });
  const jobs = data?.jobs || [];
  const savedJobs = jobs.filter(j => bookmarked.includes(j.id.toString()));

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-[var(--ink-3)]">{savedJobs.length} saved job{savedJobs.length !== 1 ? 's' : ''}</p>
      </motion.div>

      {isLoading ? (
        <div className="card-double-border p-20 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-[var(--ink-3)]">Loading bookmarks...</p>
        </div>
      ) : savedJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-double-border p-20 flex flex-col items-center justify-center text-center"
        >
          <Bookmark className="w-12 h-12 text-[var(--ink-4)] mb-4" />
          <h3 className="font-serif text-2xl text-[var(--ink)] mb-2">No saved jobs yet</h3>
          <p className="text-sm text-[var(--ink-3)] mb-6">Bookmark jobs as you browse to track them here.</p>
          <Link href="/jobs" className="flex items-center gap-2 px-5 py-2.5 bg-[var(--ink)] text-white text-sm font-medium rounded hover:bg-[var(--teal)] transition-colors">
            Browse Jobs
          </Link>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-3">
          {savedJobs.map((job, i) => {
            const salary = formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency);
            const savedDate = savedDates[job.id.toString()];
            const status = statuses[job.id.toString()] ?? 'Interested';

            return (
              <motion.div
                key={job.id}
                className="card-double-border p-5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  {/* Company logo */}
                  <div className="w-10 h-10 rounded bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
                    {job.company.logoUrl ? (
                      <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-serif italic text-[var(--teal)] font-bold">{job.company.name.charAt(0)}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                      <div>
                        <Link href={`/jobs/${job.id}`} className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors">
                          {job.title}
                        </Link>
                        <p className="text-sm text-[var(--ink-3)]">{job.company.name}</p>
                      </div>

                      {/* Status selector */}
                      <select
                        id={`status-${job.id}`}
                        value={status}
                        onChange={e => setStatus(job.id.toString(), e.target.value)}
                        className={cn(
                          'text-xs font-medium px-2 py-1 rounded border cursor-pointer outline-none bg-transparent',
                          STATUS_COLORS[status] ?? 'bg-[var(--bg-alt)] text-[var(--ink-2)] border-[var(--border)]'
                        )}
                      >
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-3)] mb-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </div>
                      {salary && <span className="font-mono text-[var(--ink-2)]">{salary}</span>}
                      {savedDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Saved {timeAgo(savedDate)}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View
                      </Link>
                      <button
                        id={`remove-bookmark-${job.id}`}
                        onClick={() => toggle(job.id.toString())}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] text-[var(--ink-3)] hover:border-rose-300 hover:text-rose-500 transition-all rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                        Remove
                      </button>
                      <a
                        href="#"
                        onClick={e => e.preventDefault()}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--ink)] text-white rounded hover:bg-[var(--teal)] transition-colors"
                      >
                        Apply
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
