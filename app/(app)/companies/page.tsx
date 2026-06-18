'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter, ChevronDown, Check } from 'lucide-react';
import CompanyCard from '@/components/cards/CompanyCard';
import { CompanyCardSkeleton } from '@/components/skeletons';
import { getCompanies, getCompaniesMeta, CompaniesMeta } from '@/lib/services/api';
import { StaggerContainer, StaggerItem } from '@/components/animations';
import { LockedResultsOverlay } from '@/components/ui/LockedResultsOverlay';
import { cn } from '@/lib/utils';
import type { Stage } from '@/types/job';
import type { Company } from '@/types/company';

// Filter Popover Component
function FilterDropdown({ label, options, selected, onChange }: { label: string, options: string[], selected: string[], onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
          selected.length > 0 
            ? "border-[var(--teal)] text-[var(--teal)] bg-[var(--teal-light)]" 
            : "border-[var(--border)] text-[var(--ink-2)] hover:border-[var(--ink-4)] bg-[var(--bg)]"
        )}
      >
        {label} {selected.length > 0 && <span className="bg-[var(--teal)] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{selected.length}</span>}
        <ChevronDown className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")} />
      </button>
      
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 w-56 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden"
          >
            <div className="max-h-64 overflow-y-auto p-1.5 custom-scrollbar">
              {options.map(opt => (
                <button
                  key={opt}
                  onClick={() => onChange(opt)}
                  className="flex items-center justify-between w-full text-left px-3 py-2.5 text-sm rounded-lg hover:bg-[var(--bg-alt)] transition-colors group"
                >
                  <span className="truncate pr-2">{opt}</span>
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                    selected.includes(opt) 
                      ? "bg-[var(--teal)] border-[var(--teal)] text-white" 
                      : "border-[var(--ink-4)] group-hover:border-[var(--ink-3)]"
                  )}>
                    {selected.includes(opt) && <Check className="w-3 h-3" />}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CompaniesPage() {
  const [search, setSearch] = useState('');
  const [stages, setStages] = useState<Stage[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [batches, setBatches] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState('newest');
  
  const [meta, setMeta] = useState<CompaniesMeta | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const limit = 20;

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    getCompaniesMeta().then(setMeta);
  }, []);

  const fetchCompanies = useCallback(async (resetOffset = false) => {
    if (resetOffset) setLoading(true);
    else setLoadingMore(true);
    
    const currentOffset = resetOffset ? 0 : offset;
    
    try {
      const res = await getCompanies({
        limit,
        offset: currentOffset,
        search: debouncedSearch,
        stage: stages,
        industry: industries,
        batch: batches,
        remoteFriendly: remoteOnly,
        sort
      });
      
      setCompanies(prev => resetOffset ? res.companies : [...prev, ...res.companies]);
      setHasMore(res.companies.length >= limit);
      setOffset(currentOffset + limit);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [debouncedSearch, stages, industries, batches, remoteOnly, sort, offset]);

  // Fetch when filters change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies(true);
  }, [debouncedSearch, stages, industries, batches, remoteOnly, sort]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchCompanies(false);
    }
  }, [loadingMore, hasMore, fetchCompanies]);

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

  const hitLimit = !hasMore && meta && companies.length < meta.totalCompanies;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-serif text-4xl text-[var(--ink)] tracking-tight">Companies</h1>
          {meta?.totalCompanies !== undefined && (
            <span className="text-xs font-mono font-bold text-[var(--teal)] px-2.5 py-1 bg-[var(--teal-light)] border border-[rgba(13,115,119,0.15)] rounded-full">
              {meta.totalCompanies.toLocaleString()} Total
            </span>
          )}
        </div>
        <p className="text-[var(--ink-3)]">Discover and filter top startups.</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="relative mb-6"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--ink-4)]" />
        <input
          id="companies-search"
          type="text"
          placeholder="Search by name, industry, or keywords..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-12 py-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded-2xl text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none focus:border-[var(--teal)] focus:ring-1 focus:ring-[var(--teal)] transition-all shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-[var(--ink-4)] hover:text-[var(--ink)] hover:bg-[var(--bg)] rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </motion.div>

      {/* Animated Filters Container */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.15 }}
        className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-[var(--bg-alt)] border border-[var(--border)] rounded-2xl shadow-sm"
      >
        <div className="flex items-center gap-2 mr-2 text-[var(--ink-3)] hidden sm:flex">
          <Filter className="w-4 h-4" />
          <span className="text-sm font-medium">Filters:</span>
        </div>

        {meta?.stages && meta.stages.length > 0 && (
          <FilterDropdown 
            label="Stage" 
            options={meta.stages} 
            selected={stages} 
            onChange={(val) => toggle(stages, val as Stage, setStages)} 
          />
        )}
        
        {meta?.industries && meta.industries.length > 0 && (
          <FilterDropdown 
            label="Industry" 
            options={meta.industries} 
            selected={industries} 
            onChange={(val) => toggle(industries, val, setIndustries)} 
          />
        )}
        
        {meta?.batches && meta.batches.length > 0 && (
          <FilterDropdown 
            label="Batch" 
            options={meta.batches} 
            selected={batches} 
            onChange={(val) => toggle(batches, val, setBatches)} 
          />
        )}

        <button
          onClick={() => setRemoteOnly(!remoteOnly)}
          className={cn(
            'px-4 py-2 rounded-xl border text-sm font-medium transition-colors',
            remoteOnly 
              ? 'border-emerald-400 text-emerald-700 bg-emerald-50' 
              : 'border-[var(--border)] text-[var(--ink-2)] hover:border-[var(--ink-4)] bg-[var(--bg)]'
          )}
        >
          Remote Friendly
        </button>

        <div className="ml-auto flex items-center gap-2 bg-[var(--bg)] px-3 py-1.5 rounded-xl border border-[var(--border)]">
           <span className="text-sm font-medium text-[var(--ink-3)] hidden sm:inline">Sort:</span>
           <select 
             value={sort} 
             onChange={(e) => setSort(e.target.value)}
             className="bg-transparent text-sm font-medium border-none text-[var(--ink)] outline-none cursor-pointer"
           >
             <option value="newest">Newest</option>
             <option value="oldest">Oldest</option>
             <option value="team_size_desc">Largest Team</option>
             <option value="team_size_asc">Smallest Team</option>
             <option value="name_asc">Name (A-Z)</option>
             <option value="name_desc">Name (Z-A)</option>
           </select>
        </div>
      </motion.div>

      {loading && offset === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)}
        </div>
      ) : companies.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 bg-[var(--bg-alt)] rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-[var(--ink-4)]" />
          </div>
          <h3 className="font-serif text-xl text-[var(--ink)] mb-2">No companies found</h3>
          <p className="text-[var(--ink-3)] max-w-sm">Try adjusting your filters or search terms to find what you&apos;re looking for.</p>
          <button 
            onClick={() => {
              setSearch('');
              setStages([]);
              setIndustries([]);
              setBatches([]);
              setRemoteOnly(false);
              setSort('newest');
            }}
            className="mt-6 px-6 py-2 bg-[var(--ink)] text-[var(--bg)] rounded-full text-sm font-medium hover:bg-[var(--ink-2)] transition-colors"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <StaggerItem key={company.id} className="h-full">
                <CompanyCard company={company} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          {hasMore && !hitLimit && (
            <div ref={lastElementRef} className="flex justify-center py-8">
              {loadingMore && (
                <div className="flex items-center gap-2 text-[var(--teal)] text-sm font-medium">
                  <div className="w-5 h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  Loading more...
                </div>
              )}
            </div>
          )}
          {hitLimit && <LockedResultsOverlay type="companies" />}
        </>
      )}
    </div>
  );
}
