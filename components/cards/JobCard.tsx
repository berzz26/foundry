'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Bookmark, ExternalLink, Zap } from 'lucide-react';
import type { Job } from '@/types/job';
import { formatSalary, timeAgo, cn } from '@/lib/utils';
import { useBookmarkStore } from '@/lib/store/bookmarks';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

export default function JobCard({ job, compact = false }: JobCardProps) {
  const { toggle, isBookmarked } = useBookmarkStore();
  const saved = isBookmarked(job.id.toString());
  const salary = formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency);

  return (
    <motion.article
      className="card-double-border p-5 group"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Company logo placeholder */}
          <div className="w-9 h-9 rounded bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden">
            {job.company.logoUrl ? (
              <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
            ) : (
              <span className="font-serif italic text-[var(--teal)] text-sm font-bold">
                {job.company.name.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <Link
              href={`/jobs/${job.id}`}
              className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors leading-tight block"
            >
              {job.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <Link
                href={`/companies/${job.company.id}`}
                className="text-xs text-[var(--ink-3)] hover:text-[var(--teal)] transition-colors"
              >
                {job.company.name}
              </Link>
              {job.company.batch && (
                <>
                  <span className="text-[var(--border-strong)]">·</span>
                  <span className="text-xs font-mono text-[var(--ink-4)]">{job.company.batch}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bookmark + Match */}
        <div className="flex items-center gap-2 shrink-0">
          {job.matchPercentage !== undefined && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border border-[rgba(13,115,119,0.2)] bg-[var(--teal-light)]">
              <Zap className="w-3 h-3 text-[var(--teal)]" />
              <span className="text-xs font-semibold text-[var(--teal)]">{job.matchPercentage}%</span>
            </div>
          )}
          <button
            id={`bookmark-${job.id}`}
            onClick={() => toggle(job.id.toString())}
            aria-label={saved ? 'Remove bookmark' : 'Bookmark job'}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded border transition-all',
              saved
                ? 'bg-[var(--teal)] border-[var(--teal)] text-white'
                : 'border-[var(--border)] text-[var(--ink-4)] hover:border-[var(--teal)] hover:text-[var(--teal)]'
            )}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Description preview */}
      {!compact && job.description && (
        <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-2 mb-3">
          {job.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-3 mb-3">
        {job.location && (
          <div className="flex items-center gap-1 text-xs text-[var(--ink-3)]">
            <MapPin className="w-3 h-3" />
            <span>{job.location}</span>
          </div>
        )}
        {job.remote !== undefined && (
          <span
            className={cn(
              'text-xs px-2 py-0.5 rounded-full border font-medium',
              job.remote
                ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                : 'border-[var(--border)] text-[var(--ink-3)]'
            )}
          >
            {job.remote ? 'Remote' : 'On-site'}
          </span>
        )}
        {salary && (
          <span className="text-xs font-mono text-[var(--ink-2)] font-medium">{salary}</span>
        )}
        <span className="text-xs text-[var(--ink-4)] ml-auto">{timeAgo(job.createdAt)}</span>
      </div>

      {/* Tech Stack */}
      {job.techStack && job.techStack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.techStack.slice(0, compact ? 3 : 5).map(tech => (
            <span key={tech} className="tech-badge">{tech}</span>
          ))}
          {job.techStack.length > (compact ? 3 : 5) && (
            <span className="tech-badge text-[var(--ink-4)]">+{job.techStack.length - (compact ? 3 : 5)}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/jobs/${job.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Details
        </Link>
        <a
          href="#"
          className="flex-1 flex items-center justify-center py-2 text-sm font-medium bg-[var(--ink)] text-white hover:bg-[var(--teal)] transition-colors rounded"
          onClick={e => e.preventDefault()}
        >
          Apply
        </a>
      </div>
    </motion.article>
  );
}
