'use client';

import { notFound } from 'next/navigation';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MapPin, Bookmark, ArrowLeft, Globe, Link2, ExternalLink as TwitterIcon,
  CheckCircle2, Briefcase, Zap,
} from 'lucide-react';
import { DUMMY_JOBS } from '@/lib/dummy-data/jobs';
import { DUMMY_COMPANIES } from '@/lib/dummy-data/companies';
import { formatSalary, timeAgo, cn } from '@/lib/utils';
import { useBookmarkStore } from '@/lib/store/bookmarks';

const LOCATION_LABELS: Record<string, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'On-site',
};

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const job = DUMMY_JOBS.find(j => j.id === id);
  if (!job) notFound();

  const company = DUMMY_COMPANIES.find(c => c.id === job.companyId);
  const { toggle, isBookmarked } = useBookmarkStore();
  const saved = isBookmarked(job.id);
  const salary = formatSalary(job.salaryMin, job.salaryMax, job.salaryCurrency);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Back */}
      <Link href="/jobs" className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-3)] hover:text-[var(--teal)] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Header Card */}
          <motion.div
            className="card-double-border p-6"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center">
                  <span className="font-serif italic text-[var(--teal)] text-xl font-bold">
                    {job.companyName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="font-serif text-2xl text-[var(--ink)] leading-tight">{job.title}</h1>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Link href={`/companies/${job.companyId}`} className="text-sm text-[var(--teal)] hover:underline font-medium">
                      {job.companyName}
                    </Link>
                    {job.batch && <span className="text-xs font-mono text-[var(--ink-4)]">{job.batch}</span>}
                  </div>
                </div>
              </div>
              <button
                id={`job-detail-bookmark-${job.id}`}
                onClick={() => toggle(job.id)}
                className={cn(
                  'w-9 h-9 flex items-center justify-center rounded border transition-all shrink-0',
                  saved ? 'bg-[var(--teal)] border-[var(--teal)] text-white' : 'border-[var(--border)] text-[var(--ink-4)] hover:border-[var(--teal)] hover:text-[var(--teal)]'
                )}
              >
                <Bookmark className="w-4 h-4" fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="flex items-center gap-1.5 text-sm text-[var(--ink-3)]">
                <MapPin className="w-3.5 h-3.5" />
                {job.location}
              </div>
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full border font-medium',
                job.locationType === 'remote' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' :
                job.locationType === 'hybrid' ? 'border-amber-200 text-amber-700 bg-amber-50' :
                'border-[var(--border)] text-[var(--ink-3)]'
              )}>
                {LOCATION_LABELS[job.locationType]}
              </span>
              {salary && <span className="text-sm font-mono text-[var(--ink-2)] font-medium">{salary}</span>}
              <span className="text-xs text-[var(--ink-4)] ml-auto">{timeAgo(job.postedAt)}</span>
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.techStack.map(t => <span key={t} className="tech-badge">{t}</span>)}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[var(--ink)] text-white text-sm font-medium hover:bg-[var(--teal)] transition-colors rounded"
              >
                <Zap className="w-4 h-4" />
                Apply Now
              </a>
              {job.matchPercentage && (
                <div className="flex items-center gap-1.5 px-4 py-2.5 border border-[rgba(13,115,119,0.2)] bg-[var(--teal-light)] rounded text-sm font-semibold text-[var(--teal)]">
                  <Zap className="w-4 h-4" />{job.matchPercentage}% Match
                </div>
              )}
            </div>
          </motion.div>

          {/* About Role */}
          <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-4">About this role</h2>
            <p className="text-sm text-[var(--ink-2)] leading-relaxed">{job.description}</p>
          </motion.section>

          {/* Responsibilities */}
          <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-4">Responsibilities</h2>
            <ul className="flex flex-col gap-2.5">
              {job.responsibilities.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-[var(--teal)] mt-0.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.section>

          {/* Requirements */}
          <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-4">Requirements</h2>
            <ul className="flex flex-col gap-2.5">
              {job.requirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-[var(--ink-2)]">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] mt-1.5 shrink-0" />
                  {r}
                </li>
              ))}
            </ul>
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-5">
          {/* Company Overview */}
          {company && (
            <motion.div className="card-double-border p-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-serif text-lg text-[var(--ink)] mb-4">About {company.name}</h2>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-4">{company.tagline}</p>
              <div className="flex flex-col gap-2 mb-4">
                {[
                  { label: 'Stage', value: company.stage.replace('-', ' ') },
                  { label: 'Industry', value: company.industry },
                  { label: 'Location', value: company.location },
                  ...(company.batch ? [{ label: 'Batch', value: company.batch }] : []),
                  ...(company.employeeCount ? [{ label: 'Team size', value: company.employeeCount }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between text-sm border-b border-[var(--border)] pb-2 last:border-0 last:pb-0">
                    <span className="text-[var(--ink-4)] text-xs uppercase tracking-wide">{label}</span>
                    <span className="text-[var(--ink-2)] font-medium capitalize">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Link href={`/companies/${company.id}`} className="flex-1 flex items-center justify-center py-2 text-xs font-medium border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded">
                  <Briefcase className="w-3 h-3 mr-1.5" />View Company
                </Link>
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-8 h-8 border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded text-[var(--ink-3)]">
                    <Globe className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </motion.div>
          )}

          {/* Founders */}
          {company && company.founders.length > 0 && (
            <motion.div className="card-double-border p-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="font-serif text-lg text-[var(--ink)] mb-4">Founders</h2>
              <div className="flex flex-col gap-3">
                {company.founders.map(f => (
                  <div key={f.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--ink)] truncate">{f.name}</p>
                      <p className="text-xs text-[var(--ink-3)] truncate">{f.role}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {f.linkedin && (
                        <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                          <Link2 className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {f.twitter && (
                        <a href={f.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                          <TwitterIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
