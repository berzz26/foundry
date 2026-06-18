'use client';

import { cn } from '@/lib/utils';
import JobCard from '@/components/cards/JobCard';
import CompanyCard from '@/components/cards/CompanyCard';

interface LockedResultsOverlayProps {
  type: 'jobs' | 'companies';
}

const DUMMY_JOBS: any[] = [
  { id: 'd1', title: 'Senior Backend Engineer (42 LPA)', company: { id: 'c1', name: 'Stealth Fintech' }, location: 'Remote', description: 'Hiring senior engineers for a high-growth payments platform.', techStack: ['Node.js', 'PostgreSQL'] },
  { id: 'd2', title: 'Platform Engineer (38 LPA)', company: { id: 'c2', name: 'Nimbus Cloud' }, location: 'Remote', description: 'Building distributed infra for AI workloads at scale.', techStack: ['Go', 'Kubernetes'] },
  { id: 'd3', title: 'Senior Product Designer (32 LPA)', company: { id: 'c3', name: 'Pixelforge Studios' }, location: 'Remote', description: 'Crafting beautiful product experiences for global users.', techStack: ['Figma', 'React'] },
  { id: 'd4', title: 'ML Engineer (55 LPA)', company: { id: 'c4', name: 'Quantia Labs' }, location: 'Remote', description: 'Applied ML research for quantitative trading strategies.', techStack: ['Python', 'PyTorch'] },
  { id: 'd5', title: 'Frontend Developer (28 LPA)', company: { id: 'c5', name: 'WebScale Inc' }, location: 'Remote', description: 'Building Next.js applications with complex state.', techStack: ['TypeScript', 'Next.js'] },
  { id: 'd6', title: 'DevOps Engineer (35 LPA)', company: { id: 'c6', name: 'CloudNative' }, location: 'Remote', description: 'Managing Kubernetes clusters and CI/CD pipelines.', techStack: ['AWS', 'Terraform'] },
];

const DUMMY_COMPANIES: any[] = [
  { id: 'c1', name: 'Stealth Fintech', tagline: 'Payments platform for the next billion users.', stage: 'seed', industry: 'Fintech', location: 'San Francisco, CA', remoteFriendly: true, techStack: ['React', 'Node.js'], openRoles: 3 },
  { id: 'c2', name: 'Nimbus Cloud', tagline: 'Distributed infra for AI workloads.', stage: 'series-a', industry: 'Infrastructure', location: 'Remote', remoteFriendly: true, techStack: ['Go', 'Kubernetes'], openRoles: 5 },
  { id: 'c3', name: 'Pixelforge Studios', tagline: 'Global product experiences.', stage: 'series-b', industry: 'Design', location: 'New York, NY', remoteFriendly: false, techStack: ['Figma', 'React'], openRoles: 2 },
  { id: 'c4', name: 'Quantia Labs', tagline: 'Quantitative trading strategies.', stage: 'seed', industry: 'Finance', location: 'London, UK', remoteFriendly: true, techStack: ['Python', 'PyTorch'], openRoles: 1 },
  { id: 'c5', name: 'WebScale Inc', tagline: 'Scaling the web.', stage: 'series-a', industry: 'Developer Tools', location: 'Remote', remoteFriendly: true, techStack: ['TypeScript', 'Next.js'], openRoles: 4 },
  { id: 'c6', name: 'CloudNative', tagline: 'Cloud infrastructure management.', stage: 'series-b', industry: 'Infrastructure', location: 'San Francisco, CA', remoteFriendly: false, techStack: ['AWS', 'Terraform'], openRoles: 6 },
];

export function LockedResultsOverlay({ type }: LockedResultsOverlayProps) {
  const gridClass = type === 'jobs' 
    ? 'grid-cols-1 md:grid-cols-2' 
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  const items = type === 'jobs' ? DUMMY_JOBS : DUMMY_COMPANIES;

  return (
    <div className="mt-8">
      <div className={cn("grid gap-4 md:gap-6 opacity-40 blur-[4px] pointer-events-none select-none grayscale-[20%]", gridClass)} aria-hidden="true">
        {items.map((item) => (
          type === 'jobs' ? <JobCard key={item.id} job={item} /> : <CompanyCard key={item.id} company={item} />
        ))}
      </div>
      
      {/* Pagination Mock */}
      <div className="flex items-center justify-center gap-2 mt-12 opacity-60 pointer-events-none select-none">
        {['1', '2', '3', '4', '5', '...', '10'].map((page, i) => (
          <div key={i} className={cn(
            "w-9 h-9 flex items-center justify-center rounded-md border text-sm font-medium",
            page === '1' 
              ? "border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]" 
              : page === '...'
              ? "border-transparent text-[var(--ink-4)]"
              : "border-[var(--border)] text-[var(--ink-3)]"
          )}>
            {page}
          </div>
        ))}
        <div className="px-3 h-9 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--ink-3)] text-sm font-medium gap-1">
          Next 
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  );
}
