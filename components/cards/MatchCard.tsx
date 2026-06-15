'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, ExternalLink, Bookmark, X, MapPin } from 'lucide-react';
import type { Job } from '@/types/job';
import { matchColor } from '@/lib/utils';
import Link from 'next/link';
import { useBookmarkStore } from '@/lib/store/bookmarks';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect } from 'react';
import { useOutsideClick } from '@/hooks/use-outside-click';

interface MatchCardProps {
  job: Job;
  explanation?: string[];
}

export default function MatchCard({ job, explanation }: MatchCardProps) {
  const { toggle, isBookmarked } = useBookmarkStore();
  const saved = isBookmarked(job.id.toString());
  const pct = job.matchPercentage ?? 0;

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
              layoutId={`match-card-${job.id}`}
              ref={ref}
              className="w-full max-w-[600px] max-h-[90vh] flex flex-col bg-[var(--bg)] rounded-2xl md:rounded-3xl overflow-hidden card-double-border shadow-2xl relative"
            >
              {/* Modal Header */}
              <div className="p-6 md:p-8 border-b border-[var(--border)] relative flex items-start gap-4 shrink-0 bg-[var(--bg-alt)]">
                <motion.div layoutId={`match-logo-${job.id}`} className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                  {job.company.logoUrl ? (
                    <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="font-serif italic text-[var(--teal)] text-3xl font-bold">
                      {job.company.name.charAt(0)}
                    </span>
                  )}
                </motion.div>
                
                <div className="flex-1 pt-1 pr-6">
                  <motion.h3 layoutId={`match-title-${job.id}`} className="font-serif text-xl md:text-2xl text-[var(--ink)] mb-2 leading-tight">
                    {job.title}
                  </motion.h3>
                  <motion.div layoutId={`match-company-${job.id}`} className="flex flex-wrap items-center gap-2 text-sm text-[var(--ink-3)]">
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
                 {/* Match Explanation */}
                 {explanation && (
                   <div className="mb-8 p-4 bg-[var(--teal-light)] border border-[rgba(13,115,119,0.15)] rounded-xl">
                     <h4 className="text-xs font-bold uppercase tracking-widest text-[var(--teal)] mb-3">Why it's a match ({pct}%)</h4>
                     <ul className="flex flex-col gap-2">
                       {explanation.map(e => (
                         <li key={e} className="flex items-start gap-2 text-sm text-[var(--ink)] font-medium">
                           <CheckCircle2 className="w-4 h-4 text-[var(--teal)] shrink-0 mt-0.5" />
                           {e}
                         </li>
                       ))}
                     </ul>
                   </div>
                 )}

                 {/* Company & Job Snapshot */}
                 <div className="mb-6 bg-[var(--bg-alt)] border border-[var(--border)] rounded-2xl p-4 md:p-5 flex flex-col gap-4">
                   <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-lg bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                         {job.company.logoUrl ? (
                           <img src={job.company.logoUrl} alt={job.company.name} className="w-full h-full object-cover" />
                         ) : (
                           <span className="font-serif italic text-[var(--teal)] text-base font-bold">
                             {job.company.name.charAt(0)}
                           </span>
                         )}
                       </div>
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
                 <motion.div layoutId={`match-desc-${job.id}`} className="text-sm md:text-base text-[var(--ink-2)] whitespace-pre-line leading-relaxed mb-8">
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
        layoutId={`match-card-${job.id}`}
        onClick={() => setActive(true)}
        className="card-double-border p-5 cursor-pointer hover:border-[var(--teal)] transition-colors"
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
            <motion.div layoutId={`match-title-${job.id}`}>
              <Link 
                href={`/jobs/${job.id}`} 
                onClick={(e) => e.stopPropagation()} 
                className="font-serif text-base text-[var(--ink)] hover:text-[var(--teal)] transition-colors leading-tight block truncate"
              >
                {job.title}
              </Link>
            </motion.div>
            <motion.div layoutId={`match-company-${job.id}`}>
              <p className="text-sm text-[var(--ink-3)] mt-0.5 mb-2 truncate">
                {job.company.name} {job.location && `· ${job.location}`}
              </p>
            </motion.div>

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
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
              >
                <ExternalLink className="w-3 h-3" />
                View Job
              </Link>
              <button
                id={`match-bookmark-${job.id}`}
                onClick={(e) => { e.stopPropagation(); toggle(job.id.toString()); }}
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
                onClick={e => { e.preventDefault(); e.stopPropagation(); }}
              >
                <Zap className="w-3 h-3" />
                Apply
              </a>
            </div>
          </div>
        </div>
      </motion.article>
    </>
  );
}
