'use client';

import { notFound } from 'next/navigation';
import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Globe, MapPin, Users, Link2, ExternalLink as TwitterIcon, ArrowRight, Briefcase } from 'lucide-react';
import { getCompanyById, getJobsByCompanyId, getFoundersByCompanyId } from '@/lib/services/api';
import JobCard from '@/components/cards/JobCard';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import type { Company } from '@/types/company';
import type { Job } from '@/types/job';
import { Markdown } from '@/components/ui/Markdown';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/contexts/AuthContext';

const STAGE_LABELS: Record<string, string> = {
  'pre-seed': 'Pre-seed', seed: 'Seed', 'series-a': 'Series A',
  'series-b': 'Series B', 'series-c': 'Series C', growth: 'Growth',
};

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [company, setCompany] = useState<Company | null>(null);
  const [openJobs, setOpenJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      try {
        const comp = await getCompanyById(id);
        if (comp) {
          const founders = await getFoundersByCompanyId(id);
          setCompany({ ...comp, founders });
          const jobs = await getJobsByCompanyId(id);
          setOpenJobs(jobs);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin mb-4" />
        <p className="text-sm text-[var(--ink-3)]">Loading company details...</p>
      </div>
    );
  }

  if (!company) notFound();

  return (
    <div className="max-w-5xl mx-auto">
      <Link href="/companies" className="inline-flex items-center gap-1.5 text-sm text-[var(--ink-3)] hover:text-[var(--teal)] transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      {/* Hero */}
      <motion.div
        className="card-double-border p-8 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap mb-6">
          <div className="flex items-center gap-5">
            <img
              src={company.logo}
              alt={company.name}
              className="w-16 h-16 rounded object-contain shrink-0"
            />
            <div>
              <h1 className="font-serif text-3xl text-[var(--ink)] leading-tight">{company.name}</h1>
              <p className="text-[var(--ink-2)] mt-1">{company.tagline}</p>
            </div>
          </div>
          {company.website && (
            <a href={company.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm font-medium text-[var(--ink-2)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded self-start">
              <Globe className="w-4 h-4" />
              Website
            </a>
          )}
        </div>

        {/* Meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Stage', value: STAGE_LABELS[company.stage] },
            { label: 'Industry', value: company.industry },
            { label: 'Location', value: company.location },
            ...(company.batch ? [{ label: 'Batch', value: company.batch }] : []),
            ...(company.employeeCount ? [{ label: 'Team Size', value: company.employeeCount }] : []),
            ...(company.foundedYear ? [{ label: 'Founded', value: company.foundedYear.toString() }] : []),
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-0.5">{label}</p>
              <p className="text-sm font-medium text-[var(--ink-2)]">{value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-3">
          <a href="#open-roles" className="flex items-center gap-2 px-5 py-2.5 bg-[var(--ink)] text-white text-sm font-medium rounded hover:bg-[var(--teal)] transition-colors">
            <Briefcase className="w-4 h-4" />
            View {openJobs.length} Open Role{openJobs.length !== 1 ? 's' : ''}
          </a>
          {company.remoteFriendly && (
            <span className="flex items-center gap-1.5 px-4 py-2.5 border border-emerald-200 text-emerald-700 bg-emerald-50 text-sm font-medium rounded">
              Remote Friendly
            </span>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* About */}
          <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-4">About {company.name}</h2>
            <Markdown content={company.description} />
          </motion.section>

          {/* Hiring */}
          {company.hiringDescription && (
            <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <h2 className="font-serif text-xl text-[var(--ink)] mb-4">How we hire</h2>
              <Markdown content={company.hiringDescription} />
            </motion.section>
          )}

          {/* Tech Stack */}
          <motion.section className="card-double-border p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h2 className="font-serif text-xl text-[var(--ink)] mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {company.techStack.map(t => <span key={t} className="tech-badge">{t}</span>)}
            </div>
          </motion.section>

          {/* Open Roles */}
          <motion.section id="open-roles" className="flex flex-col gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-[var(--ink)]">Open Roles ({openJobs.length})</h2>
              <Link href={`/jobs?company=${company.id}`} className="text-sm text-[var(--teal)] flex items-center gap-1 hover:gap-2 transition-all">
                All jobs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {openJobs.length === 0 ? (
              <div className="card-double-border p-8 text-center">
                <p className="text-sm text-[var(--ink-3)]">No open roles right now. Check back soon.</p>
              </div>
            ) : (
              <StaggerContainer className="flex flex-col gap-4">
                {openJobs.map(job => (
                  <StaggerItem key={job.id}>
                    <JobCard job={job} compact />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </motion.section>
        </div>

        {/* Sidebar: Founders */}
        <div className="flex flex-col gap-5">
          <motion.section className={cn("card-double-border p-5", !user && "opacity-40 blur-[4px] pointer-events-none select-none grayscale-[20%]")} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="font-serif text-lg text-[var(--ink)] mb-4">Founders</h2>
            <div className="flex flex-col gap-4">
              {company.founders.map(f => (
                <div key={f.id} className="flex items-center gap-3 group">
                  <div className="w-10 h-10 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-sm font-semibold shrink-0 overflow-hidden">
                    {(f.avatarThumb || f.avatarUrl || f.avatar) ? (
                      <img src={f.avatarThumb || f.avatarUrl || f.avatar} alt={f.fullName || f.name || ''} className="w-full h-full object-cover" />
                    ) : (
                      (f.fullName || f.name || '?').split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--ink)]">{f.fullName || f.name || 'Unknown Founder'}</p>
                    <p className="text-xs text-[var(--ink-3)]">{f.role}</p>
                  </div>
                  <div className="flex gap-2">
                    {f.linkedin && (
                      <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                        <Link2 className="w-4 h-4" />
                      </a>
                    )}
                    {f.twitter && (
                      <a href={f.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                        <TwitterIcon className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {/* NOTE: Founder emails intentionally not shown (V1 spec) */}
          </motion.section>

          {/* Stats */}
          <motion.div className="card-double-border p-5" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-serif text-lg text-[var(--ink)] mb-4">Quick Stats</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--ink-3)] flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Open Roles</span>
                <span className="font-semibold text-[var(--ink)]">{openJobs.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--ink-3)] flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> Team Size</span>
                <span className="font-semibold text-[var(--ink)]">{company.employeeCount || '—'}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--ink-3)] flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Remote</span>
                <span className={`font-semibold ${company.remoteFriendly ? 'text-emerald-600' : 'text-[var(--ink-3)]'}`}>
                  {company.remoteFriendly ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
