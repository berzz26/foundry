'use client';

import { motion } from 'framer-motion';
import { Briefcase, Bookmark, Building2, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { DUMMY_JOBS } from '@/lib/dummy-data/jobs';
import { DUMMY_COMPANIES } from '@/lib/dummy-data/companies';
import { useBookmarkStore } from '@/lib/store/bookmarks';
import JobCard from '@/components/cards/JobCard';
import CompanyCard from '@/components/cards/CompanyCard';
import { SectionReveal, StaggerContainer, StaggerItem } from '@/components/animations';

function StatCard({ icon: Icon, label, value, sub, color = 'teal' }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color?: string;
}) {
  return (
    <motion.div
      className="stat-card flex flex-col gap-1"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)]">{label}</p>
        <div className="w-7 h-7 rounded bg-[var(--teal-light)] flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[var(--teal)]" />
        </div>
      </div>
      <span className="font-serif text-3xl text-[var(--ink)]">{value}</span>
      {sub && <p className="text-xs text-[var(--ink-3)]">{sub}</p>}
    </motion.div>
  );
}

export default function DashboardPage() {
  const { bookmarked } = useBookmarkStore();

  const recommendedJobs = DUMMY_JOBS
    .filter(j => j.matchPercentage !== undefined)
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0))
    .slice(0, 4);

  const recentJobs = [...DUMMY_JOBS]
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 4);

  const trendingCompanies = DUMMY_COMPANIES.slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-serif text-3xl text-[var(--ink)]">Good morning, Engineer. 👋</h1>
        <p className="text-sm text-[var(--ink-3)] mt-1">Here&apos;s your job activity overview.</p>
      </motion.div>

      {/* Stats */}
      <SectionReveal delay={0.05}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Briefcase} label="Total Jobs" value={DUMMY_JOBS.length} sub="Across all companies" />
          <StatCard icon={Bookmark} label="Saved Jobs" value={bookmarked.length} sub="In your bookmarks" />
          <StatCard icon={TrendingUp} label="Matched Jobs" value={DUMMY_JOBS.filter(j => j.matchPercentage).length} sub="Based on your resume" />
          <StatCard icon={Building2} label="Companies" value={DUMMY_COMPANIES.length} sub="Actively hiring" />
        </div>
      </SectionReveal>

      {/* Recommended Jobs */}
      <section>
        <SectionReveal>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--ink)]">Recommended Jobs</h2>
            <Link href="/resume-match" className="text-sm text-[var(--teal)] flex items-center gap-1 hover:gap-2 transition-all">
              Upload resume <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </SectionReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendedJobs.map(job => (
            <StaggerItem key={job.id}>
              <JobCard job={job} compact />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Trending Companies */}
      <section>
        <SectionReveal>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--ink)]">Trending Companies</h2>
            <Link href="/companies" className="text-sm text-[var(--teal)] flex items-center gap-1 hover:gap-2 transition-all">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </SectionReveal>
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingCompanies.map(company => (
            <StaggerItem key={company.id}>
              <CompanyCard company={company} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Recently Added */}
      <section>
        <SectionReveal>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl text-[var(--ink)]">Recently Added</h2>
            <Link href="/jobs" className="text-sm text-[var(--teal)] flex items-center gap-1 hover:gap-2 transition-all">
              All jobs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </SectionReveal>
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recentJobs.map(job => (
            <StaggerItem key={job.id}>
              <JobCard job={job} compact />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>
    </div>
  );
}
