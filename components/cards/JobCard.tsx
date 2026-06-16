'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MapPin, Bookmark, ExternalLink, Zap, X } from 'lucide-react';
import type { Job } from '@/types/job';
import { formatSalary, cn } from '@/lib/utils';
import { useBookmarkStore } from '@/lib/store/bookmarks';
import { useState, useRef, useEffect } from 'react';
import { useOutsideClick } from '@/hooks/use-outside-click';

interface JobCardProps {
  job: Job;
  compact?: boolean;
}

export default function JobCard({ job, compact = false }: JobCardProps) {
  const { toggle, isBookmarked } = useBookmarkStore();
  const saved = isBookmarked(job.id.toString());
  const salary = formatSalary(job.salary?.min, job.salary?.max, job.salary?.currency);

  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, () => setActive(false));

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }
    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-50"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100] p-4 md:p-8">
            <motion.div
              layoutId={`card-${job.id}`}
              ref={ref}
              className="w-full max-w-[600px] max-h-[90vh] flex flex-col bg-[var(--bg)] rounded-2xl md:rounded-3xl overflow-hidden card-double-border shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-[var(--border)] relative flex items-start gap-4 shrink-0 bg-[var(--bg-alt)]">
                {job.company.logoUrl ? (
                  <motion.img
                    layoutId={`logo-${job.id}`}
                    src={job.company.logoUrl}
                    alt={job.company.name}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-contain shrink-0"
                  />
                ) : (
                  <motion.div
                    layoutId={`logo-${job.id}`}
                    className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm"
                  >
                    <span className="font-serif italic text-[var(--teal)] text-3xl font-bold">
                      {job.company.name.charAt(0)}
                    </span>
                  </motion.div>
                )}
                
                <div className="flex-1 pt-1 pr-6">
                  <motion.h3 layoutId={`title-${job.id}`} className="font-serif text-xl md:text-2xl text-[var(--ink)] mb-2 leading-tight">
                    {job.title}
                  </motion.h3>
                  <motion.div layoutId={`company-${job.id}`} className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-3)]">
                    <span className="font-medium text-[var(--ink-2)]">{job.company.name}</span>
                    {job.location && (
                      <>
                        <span className="text-[var(--border-strong)]">·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                      </>
                    )}
                  </motion.div>
                </div>
                
                <button 
                  onClick={() => setActive(false)} 
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-[var(--teal-light)] hover:text-[var(--teal)] transition-colors text-[var(--ink-4)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 overflow-y-auto flex-1">
                 {/* Company & Job Snapshot */}
                 <div className="mb-6 bg-[var(--bg-alt)] border border-[var(--border)] rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                   <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                     <div className="flex items-center gap-3">
                        {job.company.logoUrl ? (
                          <img
                            src={job.company.logoUrl}
                            alt={job.company.name}
                            className="w-10 h-10 rounded-lg object-contain shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 shadow-sm">
                            <span className="font-serif italic text-[var(--teal)] text-base font-bold">
                              {job.company.name.charAt(0)}
                            </span>
                          </div>
                        )}
                       <div>
                         <Link 
                           href={`/companies/${job.company.id}`}
                           onClick={() => setActive(false)}
                           className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors font-semibold"
                         >
                           {job.company.name}
                         </Link>
                         <p className="text-[10px] text-[var(--ink-4)] uppercase tracking-wider font-mono">Company ID: {job.company.id}</p>
                       </div>
                     </div>
                     {job.company.batch && (
                       <span className="px-2.5 py-1 rounded bg-[var(--teal-light)] border border-[rgba(13,115,119,0.15)] text-xs font-mono font-bold text-[var(--teal)]">
                         {job.company.batch} Batch
                       </span>
                     )}
                   </div>
                   
                   <div className="grid grid-cols-2 gap-3 text-sm">
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] uppercase tracking-wider text-[var(--ink-4)] font-bold">Experience Required</span>
                       <span className="text-[var(--ink-2)] font-medium">
                         {job.experience?.minYears !== undefined && job.experience.minYears !== null
                           ? `${job.experience.minYears}+ year${job.experience.minYears !== 1 ? 's' : ''}`
                           : 'Not specified'}
                       </span>
                     </div>
                     <div className="flex flex-col gap-0.5">
                       <span className="text-[10px] uppercase tracking-wider text-[var(--ink-4)] font-bold">Location</span>
                       <span className="text-[var(--ink-2)] font-medium flex items-center gap-1">
                         <MapPin className="w-3.5 h-3.5 text-[var(--ink-3)] shrink-0" />
                         <span className="truncate">{job.location || 'Not specified'}</span>
                         {job.remote !== undefined && (
                           <span className="text-[10px] text-[var(--ink-4)]">({job.remote ? 'Remote' : 'On-site'})</span>
                         )}
                       </span>
                     </div>
                   </div>
                 </div>

                 <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-3">About the role</h4>
                 <motion.div layoutId={`desc-${job.id}`} className="text-sm md:text-base text-[var(--ink-2)] whitespace-pre-line leading-relaxed mb-8">
                   {job.description || "No detailed description provided for this position."}
                 </motion.div>
                 
                 {job.techStack && job.techStack.length > 0 && (
                   <>
                     <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-3">Tech Stack</h4>
                     <div className="flex flex-wrap gap-2 mb-8">
                       {job.techStack.map(tech => (
                         <span key={tech} className="tech-badge px-3 py-1.5 text-sm">{tech}</span>
                       ))}
                     </div>
                   </>
                 )}

                 <div className="grid grid-cols-2 gap-4 pt-6 border-t border-[var(--border)]">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="flex items-center justify-center gap-2 py-3 text-sm font-medium text-[var(--ink)] border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded-lg"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Full Details
                    </Link>
                    <a
                      href="#"
                      className="flex items-center justify-center py-3 text-sm font-medium bg-[var(--ink)] text-white hover:bg-[var(--teal)] shadow-md transition-colors rounded-lg"
                      onClick={e => { e.preventDefault(); e.stopPropagation(); }}
                    >
                      Apply Now
                    </a>
                 </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.article
        layoutId={`card-${job.id}`}
        onClick={() => setActive(true)}
        className="card-double-border p-5 group cursor-pointer relative bg-[var(--bg)]"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {job.company.logoUrl ? (
              <motion.img
                layoutId={`logo-${job.id}`}
                src={job.company.logoUrl}
                alt={job.company.name}
                className="w-10 h-10 rounded object-contain shrink-0"
              />
            ) : (
              <motion.div
                layoutId={`logo-${job.id}`}
                className="w-10 h-10 rounded bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0"
              >
                <span className="font-serif italic text-[var(--teal)] text-sm font-bold">
                  {job.company.name.charAt(0)}
                </span>
              </motion.div>
            )}
            <div className="min-w-0">
              <motion.div layoutId={`title-${job.id}`}>
                <Link
                  href={`/jobs/${job.id}`}
                  onClick={e => e.stopPropagation()}
                  className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors leading-tight block truncate"
                >
                  {job.title}
                </Link>
              </motion.div>
              <motion.div layoutId={`company-${job.id}`} className="flex items-center gap-2 mt-0.5 truncate">
                <Link
                  href={`/companies/${job.company.id}`}
                  onClick={e => e.stopPropagation()}
                  className="text-xs text-[var(--ink-3)] hover:text-[var(--teal)] transition-colors truncate"
                >
                  {job.company.name}
                </Link>
                {job.company.batch && (
                  <>
                    <span className="text-[var(--border-strong)] shrink-0">·</span>
                    <span className="text-xs font-mono text-[var(--ink-4)] shrink-0">{job.company.batch}</span>
                  </>
                )}
              </motion.div>
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
              onClick={(e) => { e.stopPropagation(); toggle(job.id.toString()); }}
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
          <motion.div layoutId={`desc-${job.id}`}>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed line-clamp-2 mb-3">
              {job.description}
            </p>
          </motion.div>
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
            onClick={e => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-[var(--ink)] border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Details
          </Link>
          <a
            href="#"
            className="flex-1 flex items-center justify-center py-2 text-sm font-medium bg-[var(--ink)] text-white hover:bg-[var(--teal)] transition-colors rounded"
            onClick={e => { e.preventDefault(); e.stopPropagation(); }}
          >
            Apply
          </a>
        </div>
      </motion.article>
    </>
  );
}
