'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Briefcase, Globe, MapPin } from 'lucide-react';
import type { Company } from '@/types/company';

const STAGE_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-seed',
  seed: 'Seed',
  'series-a': 'Series A',
  'series-b': 'Series B',
  'series-c': 'Series C',
  growth: 'Growth',
};

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <motion.article
      className="card-double-border p-5 group flex flex-col"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* Logo + Name */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={company.smallLogoUrl}
          alt={company.name}
          className="w-10 h-10 rounded object-contain shrink-0"
        />

        <div>
          <h3 className="font-serif text-base text-[var(--ink)] group-hover:text-[var(--teal)] transition-colors leading-tight">
            {company.name}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs font-mono text-[var(--ink-4)]">{STAGE_LABELS[company.stage]}</span>
            {company.batch && (
              <>
                <span className="text-[var(--border-strong)]">·</span>
                <span className="text-xs font-mono text-[var(--ink-4)]">{company.batch}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tagline */}
      <p className="text-sm text-[var(--ink-2)] leading-relaxed mb-3 line-clamp-2 flex-1">
        {company.tagline}
      </p>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--ink-3)] mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          <span>{company.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          <span>{company.openJobsCount} open role{company.openJobsCount !== 1 ? 's' : ''}</span>
        </div>
        {company.remoteFriendly && (
          <span className="px-2 py-0.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 font-medium">
            Remote OK
          </span>
        )}
      </div>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {company.techStack.slice(0, 4).map(t => (
          <span key={t} className="tech-badge">{t}</span>
        ))}
        {company.techStack.length > 4 && (
          <span className="tech-badge text-[var(--ink-4)]">+{company.techStack.length - 4}</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/companies/${company.id}`}
          className="flex-1 flex items-center justify-center py-2 text-sm font-medium text-[var(--ink)] border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded"
        >
          View Company
        </Link>
        <Link
          href={`/jobs?company=${company.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium bg-[var(--ink)] text-white hover:bg-[var(--teal)] transition-colors rounded"
        >
          <Globe className="w-3.5 h-3.5" />
          View Jobs
        </Link>
      </div>
    </motion.article>
  );
}
