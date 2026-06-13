'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import CompanyCard from '@/components/cards/CompanyCard';
import { CompanyCardSkeleton } from '@/components/skeletons';
import { getCompanies } from '@/lib/services/api';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { cn } from '@/lib/utils';
import type { Stage } from '@/types/job';
import type { Company } from '@/types/company';

const STAGES: { value: Stage; label: string }[] = [
  { value: 'pre-seed', label: 'Pre-seed' },
  { value: 'seed', label: 'Seed' },
  { value: 'series-a', label: 'Series A' },
  { value: 'series-b', label: 'Series B' },
];

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [stages, setStages] = useState<Stage[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  useEffect(() => {
    getCompanies({ limit, offset: 0 })
      .then(res => {
        setCompanies(res.companies);
        setHasMore(res.companies.length >= limit);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextOffset = offset + limit;
    getCompanies({ limit, offset: nextOffset })
      .then(res => {
        setCompanies(prev => {
          const newCompanies = res.companies.filter(
            c => !prev.some(p => p.id === c.id)
          );
          return [...prev, ...newCompanies];
        });
        setHasMore(res.companies.length >= limit);
        setOffset(nextOffset);
        setLoadingMore(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingMore(false);
      });
  }, [loadingMore, hasMore, offset]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasMore, loadMore]);

  const toggle = <T extends string>(arr: T[], val: T, set: (a: T[]) => void) =>
    set(arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]);

  const industriesList = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => {
      if (c.industry) set.add(c.industry);
    });
    return Array.from(set).sort();
  }, [companies]);

  const batchesList = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => {
      if (c.batch) set.add(c.batch);
    });
    return Array.from(set).sort();
  }, [companies]);

  const filtered = useMemo(() => {
    let companiesList = companies;
    const q = search.toLowerCase().trim();
    if (q) companiesList = companiesList.filter(c => c.name.toLowerCase().includes(q) || c.tagline.toLowerCase().includes(q) || c.industry.toLowerCase().includes(q));
    if (stages.length) companiesList = companiesList.filter(c => stages.includes(c.stage));
    if (industries.length) companiesList = companiesList.filter(c => industries.includes(c.industry));
    if (batches.length) companiesList = companiesList.filter(c => c.batch && batches.includes(c.batch));
    if (remoteOnly) companiesList = companiesList.filter(c => c.remoteFriendly);
    return companiesList;
  }, [companies, search, stages, industries, batches, remoteOnly]);

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <p className="text-sm text-[var(--ink-3)]">{filtered.length} compan{filtered.length !== 1 ? 'ies' : 'y'} found</p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--ink-4)]" />
        <input
          id="companies-search"
          type="text"
          placeholder="Search by name, industry, or keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-3 bg-[var(--bg-alt)] border border-[var(--border)] text-[var(--ink)] placeholder:text-[var(--ink-4)] text-sm outline-none focus:border-[var(--teal)] transition-colors"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)] hover:text-[var(--teal)]">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Stage chips */}
        <div className="flex flex-wrap gap-1.5">
          {STAGES.map(s => (
            <button key={s.value} id={`stage-filter-${s.value}`}
              onClick={() => toggle(stages, s.value, setStages)}
              className={cn('tech-badge cursor-pointer', stages.includes(s.value) && 'border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]')}
            >{s.label}</button>
          ))}
        </div>
        {batchesList.length > 0 && <div className="w-px bg-[var(--border)] hidden sm:block" />}
        {/* Batch chips */}
        <div className="flex flex-wrap gap-1.5">
          {batchesList.map(b => (
            <button key={b} id={`batch-filter-${b.replace(/\s/g, '-')}`}
              onClick={() => toggle(batches, b, setBatches)}
              className={cn('tech-badge cursor-pointer font-mono', batches.includes(b) && 'border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]')}
            >{b}</button>
          ))}
        </div>
        <div className="w-px bg-[var(--border)] hidden sm:block" />
        {/* Remote toggle */}
        <button
          id="remote-filter"
          onClick={() => setRemoteOnly(!remoteOnly)}
          className={cn('tech-badge cursor-pointer', remoteOnly && 'border-emerald-400 text-emerald-700 bg-emerald-50')}
        >Remote Friendly</button>
      </div>

      {/* Industry filter */}
      <div className="flex flex-wrap gap-1.5 mb-8">
        {industriesList.map(ind => (
          <button key={ind} id={`industry-filter-${ind.replace(/\s/g, '-')}`}
            onClick={() => toggle(industries, ind, setIndustries)}
            className={cn('tech-badge cursor-pointer', industries.includes(ind) && 'border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]')}
          >{ind}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="w-10 h-10 text-[var(--ink-4)] mb-4" />
          <h3 className="font-serif text-xl text-[var(--ink)] mb-2">No companies found</h3>
          <p className="text-sm text-[var(--ink-3)]">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(company => (
              <StaggerItem key={company.id}>
                <CompanyCard company={company} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          {hasMore && (
            <div ref={lastElementRef} className="flex justify-center py-8">
              {loadingMore && <div className="w-8 h-8 rounded-full border-2 border-[var(--teal)] border-t-transparent animate-spin" />}
            </div>
          )}
        </>
      )}
    </div>
  );
}
