'use client';

import { motion } from 'framer-motion';
import { Zap, CheckCircle2, ExternalLink, Bookmark } from 'lucide-react';
import type { Job } from '@/types/job';
import { matchColor } from '@/lib/utils';
import Link from 'next/link';
import { useBookmarkStore } from '@/lib/store/bookmarks';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  job: Job;
  explanation?: string[];
}

export default function MatchCard({ job, explanation }: MatchCardProps) {
  const { toggle, isBookmarked } = useBookmarkStore();
  const saved = isBookmarked(job.id.toString());
  const pct = job.matchPercentage ?? 0;

  return (
    <motion.article
      className="card-double-border p-5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div className="flex items-start gap-4">
        {/* Match Score Ring */}
        <div className="shrink-0 flex flex-col items-center gap-1">
          <div className="relative w-14 h-14">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56" aria-hidden="true">
              <circle cx="28" cy="28" r="22" fill="none" stroke="var(--border)" strokeWidth="3" />
              <circle
                cx="28" cy="28" r="22"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 22}`}
                strokeDashoffset={`${2 * Math.PI * 22 * (1 - pct / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={cn('text-sm font-bold font-mono', matchColor(pct))}>{pct}%</span>
            </div>
          </div>
          <span className="text-[10px] text-[var(--ink-4)] uppercase tracking-wide">Match</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/jobs/${job.id}`} className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors leading-tight block">
            {job.title}
          </Link>
          <p className="text-sm text-[var(--ink-3)] mt-0.5 mb-2">{job.company.name} {job.location && `· ${job.location}`}</p>

          {/* Explanation */}
          {explanation && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[var(--ink-3)] mb-1.5">Strong alignment with:</p>
              <ul className="flex flex-col gap-1">
                {explanation.map(e => (
                  <li key={e} className="flex items-center gap-1.5 text-xs text-[var(--ink-2)]">
                    <CheckCircle2 className="w-3 h-3 text-[var(--teal)] shrink-0" />
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech */}
          {job.techStack && job.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {job.techStack.slice(0, 4).map(t => (
                <span key={t} className="tech-badge">{t}</span>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href={`/jobs/${job.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
            >
              <ExternalLink className="w-3 h-3" />
              View Job
            </Link>
            <button
              id={`match-bookmark-${job.id}`}
              onClick={() => toggle(job.id.toString())}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all',
                saved
                  ? 'bg-[var(--teal)] text-white'
                  : 'border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)]'
              )}
            >
              <Bookmark className="w-3 h-3" fill={saved ? 'currentColor' : 'none'} />
              {saved ? 'Saved' : 'Save'}
            </button>
            <a
              href="#"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[var(--ink)] text-white rounded hover:bg-[var(--teal)] transition-colors"
              onClick={e => e.preventDefault()}
            >
              <Zap className="w-3 h-3" />
              Apply
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
