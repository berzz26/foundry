'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import JobCard from '@/components/cards/JobCard';
import { JobCardSkeleton } from '@/components/skeletons';
import { useJobs } from '@/lib/hooks/useJobs';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { LockedResultsOverlay } from '@/components/ui/LockedResultsOverlay';
import { cn } from '@/lib/utils';
import type { LocationType, Stage } from '@/types/job';

const LOCATION_TYPES: { value: LocationType; label: string }[] = [
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'onsite', label: 'On-site' },
];

const STAGES: { value: Stage; label: string }[] = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
];

const INDUSTRIES = ['Developer Tools', 'Infrastructure', 'Fintech', 'HealthTech', 'Data Infrastructure', 'Cloud Infrastructure'];
const TECH_STACKS = ['TypeScript', 'Go', 'Rust', 'Python', 'React', 'Node.js', 'PostgreSQL', 'Kubernetes'];

interface Filters {
  search: string;
  locationTypes: LocationType[];
  stages: Stage[];
  industries: string[];
  techStack: string[];
}

function FilterContent({
  filters, onChange,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
}) {
  const toggle = <T extends string>(arr: T[], val: T): T[] =>
    arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];

  return (
    <div className="flex flex-col gap-6">
      {/* Location */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2.5">Location</p>
        <div className="flex flex-col gap-1.5">
          {LOCATION_TYPES.map(l => (
            <label key={l.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.locationTypes.includes(l.value)}
                onChange={() => onChange({ ...filters, locationTypes: toggle(filters.locationTypes, l.value) })}
                className="w-3.5 h-3.5 accent-[var(--teal)] rounded"
              />
              <span className="text-sm text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">{l.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Stage */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2.5">Company Stage</p>
        <div className="flex flex-col gap-1.5">
          {STAGES.map(s => (
            <label key={s.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.stages.includes(s.value)}
                onChange={() => onChange({ ...filters, stages: toggle(filters.stages, s.value) })}
                className="w-3.5 h-3.5 accent-[var(--teal)] rounded"
              />
              <span className="text-sm text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Industry */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2.5">Industry</p>
        <div className="flex flex-col gap-1.5">
          {INDUSTRIES.map(ind => (
            <label key={ind} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.industries.includes(ind)}
                onChange={() => onChange({ ...filters, industries: toggle(filters.industries, ind) })}
                className="w-3.5 h-3.5 accent-[var(--teal)] rounded"
              />
              <span className="text-sm text-[var(--ink-2)] group-hover:text-[var(--ink)] transition-colors">{ind}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2.5">Tech Stack</p>
        <div className="flex flex-wrap gap-1.5">
          {TECH_STACKS.map(t => (
            <button
              key={t}
              id={`filter-tech-${t}`}
              onClick={() => onChange({ ...filters, techStack: toggle(filters.techStack, t) })}
              className={cn(
                'tech-badge cursor-pointer transition-all',
                filters.techStack.includes(t) && 'border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function JobsPage() {
  const [filters, setFilters] = useState<Filters>({
    search: '', locationTypes: [], stages: [], industries: [], techStack: [],
  });
  const { data, isLoading } = useJobs({ limit: 50 }); // Fetch more for local filtering if needed
  const jobs = useMemo(() => data?.jobs || [], [data?.jobs]);

  const filtered = useMemo(() => {
    let filteredJobs = jobs;
    const q = filters.search.toLowerCase().trim();
    if (q) {
      filteredJobs = filteredJobs.filter(
        j => j.title.toLowerCase().includes(q) || j.company.name.toLowerCase().includes(q) ||
          (j.techStack && j.techStack.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (filters.locationTypes.length) {
      filteredJobs = filteredJobs.filter(j => {
        const loc = j.remote ? 'remote' : 'onsite'; // Simplified logic, since locationType is gone
        return filters.locationTypes.includes(loc as LocationType);
      });
    }
    if (filters.stages.length) filteredJobs = filteredJobs.filter(j => j.stage && filters.stages.includes(j.stage));
    if (filters.industries.length) filteredJobs = filteredJobs.filter(j => j.industry && filters.industries.includes(j.industry));
    if (filters.techStack.length) filteredJobs = filteredJobs.filter(j => j.techStack && filters.techStack.some(t => j.techStack!.includes(t)));
    return filteredJobs;
  }, [filters, jobs]);

  const activeFilterCount = filters.locationTypes.length + filters.stages.length + filters.industries.length + filters.techStack.length;
  const hitLimit = !!data && data.jobs.length < data.pagination.total;

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-[var(--ink-3)] mt-0.5">
          {data?.pagination.total} job{data?.pagination.total !== 1 ? 's' : ''} found
        </p>
      </motion.div>

      {/* Search bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-4)]" />
        <input
          id="jobs-search"
          type="text"
          placeholder="Search by title, company, or technology..."
          value={filters.search}
          onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
          className="w-full pl-10 pr-4 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--ink-4)] text-sm outline-none focus:border-[var(--teal)] transition-colors"
        />
        {filters.search && (
          <button onClick={() => setFilters(f => ({ ...f, search: '' }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--teal)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop Filters */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[var(--ink)]">Filters</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters(f => ({ ...f, locationTypes: [], stages: [], industries: [], techStack: [] }))}
                  className="text-xs text-[var(--teal)] hover:underline"
                >
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>
            <FilterContent filters={filters} onChange={setFilters} />
          </div>
        </aside>

        {/* Jobs Grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter button */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <button id="mobile-filter-btn" className="flex items-center gap-2 px-4 py-2 border border-[var(--border)] text-sm font-medium text-[var(--ink)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded" />
                }
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[var(--bg)] border-r border-[var(--border)] p-6 overflow-y-auto">
                <SheetHeader className="mb-6">
                  <SheetTitle className="font-serif text-lg text-[var(--ink)]">Filter Jobs</SheetTitle>
                </SheetHeader>
                <FilterContent filters={filters} onChange={setFilters} />
              </SheetContent>
            </Sheet>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Search className="w-10 h-10 text-[var(--ink-4)] mb-4" />
              <h3 className="font-serif text-xl text-[var(--ink)] mb-2">No jobs found</h3>
              <p className="text-sm text-[var(--ink-3)]">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map(job => (
                  <StaggerItem key={job.id}>
                    <JobCard job={job} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
              {hitLimit && <LockedResultsOverlay type="jobs" />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
