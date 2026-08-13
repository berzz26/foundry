"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getOutreachCards, DeckCard, FounderRecipient, groupOutreachCards, normalizeWebsiteUrl } from '@/lib/api/outreach';
import { SwipeCard } from './SwipeCard';
import { ComposeDM } from './ComposeDM';
import { CopyMetaButton } from './CopyMetaButton';
import {
  Loader2, RefreshCcw, Search, Filter,
  ChevronLeft, ChevronRight, LayoutGrid, Layers, Mail,
  Building, Users, Briefcase, ExternalLink, Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Markdown } from '@/components/ui/Markdown';
import { SaveJobButton } from './SaveJobButton';
import { useSavedJobs } from '@/lib/hooks/useSavedJobs';



import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

export function SwipeDeck() {
  const [viewMode, setViewMode] = useState<'deck' | 'list'>('deck');
  const [cards, setCards] = useState<DeckCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useSavedJobs(); // Sync saved-job ids for save buttons
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const cardsRef = useRef<DeckCard[]>([]);
  const noProgressCountRef = useRef(0);
  
  const [search, setSearch] = useState('');
  const [hasJob, setHasJob] = useState(false);
  const limit = 10;

  // For list view compose modal
  const [compose, setCompose] = useState<{ card: DeckCard; founder: FounderRecipient } | null>(null);

  const fetchCards = useCallback(async (reset = false) => {
    try {
      const currentOffset = reset ? 0 : offset;
      if (reset) {
        setLoading(true);
      } else {
        setIsFetchingMore(true);
      }
      setError(null);
      
      const res = await getOutreachCards(limit, currentOffset, undefined, search, hasJob ? true : undefined);
      const grouped = groupOutreachCards(res.cards);

      const merge = (prev: DeckCard[]) => {
        const map = new Map<number, DeckCard>(prev.map(c => [c.outreachId, c]));
        for (const inc of grouped) {
          const cur = map.get(inc.outreachId);
          if (!cur) {
            map.set(inc.outreachId, inc);
          } else {
            const founderIds = new Set(cur.founders.map(f => f.founderId));
            cur.founders = [...cur.founders, ...inc.founders.filter(f => !founderIds.has(f.founderId))];
          }
        }
        return [...map.values()];
      };

      if (reset) {
        const next = merge([]);
        cardsRef.current = next;
        noProgressCountRef.current = 0;
        setCards(next);
        setCurrentIndex(0);
        setHasNext(res.pagination.hasNext);
      } else {
        const prev = cardsRef.current;
        const next = merge(prev);
        cardsRef.current = next;
        setCards(next);
        if (next.length > prev.length) {
          noProgressCountRef.current = 0;
          setHasNext(res.pagination.hasNext);
        } else if (res.cards.length === 0) {
          noProgressCountRef.current = 0;
          setHasNext(false);
        } else {
          // Nothing new came back. Give randomization a couple of chances
          // to yield unseen cards, then stop to avoid a request loop.
          noProgressCountRef.current += 1;
          setHasNext(noProgressCountRef.current >= 2 ? false : res.pagination.hasNext);
        }
      }

      setOffset(res.pagination.offset + limit);
    } catch (err: any) {
      console.error('Failed to fetch outreach cards:', err);
      setError('Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  }, [offset, limit, search, hasJob]);

  useEffect(() => {
    fetchCards(true);
  }, [search, hasJob]);

  // Refetch more if stack gets small
  useEffect(() => {
    if (cards.length - currentIndex < 3 && hasNext && !isFetchingMore && !loading) {
      fetchCards(false);
    }
  }, [cards.length, currentIndex, hasNext, isFetchingMore, loading, fetchCards]);

  // Load more for list view when scrolled near bottom
  useEffect(() => {
    if (viewMode === 'list' && hasNext && !isFetchingMore && !loading && cards.length > 0) {
      const handleScroll = () => {
        const scrollable = document.getElementById('list-scroll-container');
        if (!scrollable) return;
        const { scrollTop, scrollHeight, clientHeight } = scrollable;
        if (scrollHeight - scrollTop - clientHeight < 200) {
          fetchCards(false);
        }
      };
      const el = document.getElementById('list-scroll-container');
      el?.addEventListener('scroll', handleScroll);
      return () => el?.removeEventListener('scroll', handleScroll);
    }
  }, [viewMode, hasNext, isFetchingMore, loading, cards.length, fetchCards]);

  const handleSwipe = () => {
    setCurrentIndex(prev => prev + 1);
  };
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleRetry = () => {
    fetchCards(true);
  };

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center flex-1 text-center p-6 max-w-md">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <span className="text-4xl">🎉</span>
      </div>
      <h3 className="text-2xl font-bold mb-2">All caught up!</h3>
      <p className="text-muted-foreground mb-6">
        You've reviewed all available prospects for now. Check back later for more.
      </p>
      {(search || hasJob) && (
        <Button variant="outline" onClick={() => { setSearch(''); setHasJob(false); }}>
          Clear Filters
        </Button>
      )}
    </div>
  );

  const renderDeck = () => {
    if (cards.length === 0 || currentIndex >= cards.length) return renderEmpty();
    return (
      <div className="relative w-full max-w-[420px] md:max-w-5xl h-[750px] max-h-[85vh] md:h-[72vh] flex items-center justify-center">
        {/* Desktop Navigation Buttons */}
        <div className="absolute -left-16 lg:-left-28 hidden md:flex items-center justify-center z-20">
          <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="w-12 h-12 rounded-full shadow-md bg-background/80 backdrop-blur border-border hover:bg-background">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </div>
        <div className="absolute -right-16 lg:-right-28 hidden md:flex items-center justify-center z-20">
          <Button variant="outline" size="icon" onClick={handleSwipe} disabled={currentIndex >= cards.length} className="w-12 h-12 rounded-full shadow-md bg-background/80 backdrop-blur border-border hover:bg-background">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="relative w-full h-full">
          <AnimatePresence>
            {cards.slice(currentIndex, currentIndex + 3).reverse().map((card, idx, arr) => {
              const isTop = idx === arr.length - 1;
              const distanceFromTop = arr.length - 1 - idx;
              return (
                <motion.div
                  key={card.outreachId}
                  initial={{ opacity: 0, scale: 0.9, y: 50 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1 - distanceFromTop * 0.04, 
                    y: distanceFromTop * 20,
                    zIndex: 10 - distanceFromTop,
                    filter: distanceFromTop > 0 ? `blur(${distanceFromTop * 4}px)` : 'blur(0px)'
                  }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)', transition: { duration: 0.2 } }}
                  className="absolute inset-0 origin-bottom"
                >
                  <SwipeCard 
                    card={card} 
                    isActive={isTop}
                    onSwipeLeft={handleSwipe}
                    onSwipeRight={handleSwipe}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    );
  };

  const renderList = () => {
    if (cards.length === 0) return renderEmpty();
    return (
      <div id="list-scroll-container" className="w-full h-full overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 max-w-full mx-auto items-start">
          {cards.map((card) => (
            <div
              key={card.outreachId}
              className="outreach-list-card group flex flex-col bg-[var(--bg)] border border-[var(--border)] rounded-2xl overflow-hidden"
            >
              {/* Company header */}
              <div className="p-4 border-b border-[var(--border)] bg-[var(--bg-alt)] flex items-start gap-3">
              {card.company.smallLogoUrl || card.company.logoUrl ? (
                <img
                  src={card.company.smallLogoUrl || card.company.logoUrl || undefined}
                  alt={card.company.name}
                  className="w-10 h-10 rounded object-contain shrink-0"
                />
              ) : (
                <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-[var(--teal)] shrink-0">
                  {card.company.name.substring(0, 2).toUpperCase()}
                </span>
              )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="font-semibold text-[var(--ink)] text-sm leading-tight truncate">
                      {card.company.name}
                    </h3>
                    {card.company.batch && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[var(--teal-light)] text-[var(--teal)] border border-[rgba(13,115,119,0.15)] shrink-0">
                        {card.company.batch}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[var(--ink-4)]">
                    {card.company.industry && (
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" /> {card.company.industry}
                      </span>
                    )}
                    {card.company.teamSize && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {card.company.teamSize}
                      </span>
                    )}
                    {card.company.website && (
                      <a
                        href={normalizeWebsiteUrl(card.company.website)}
                        target="_blank"
                        rel="noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="flex items-center gap-1 hover:text-[var(--teal)]"
                      >
                        <ExternalLink className="w-3 h-3" /> Visit Site
                      </a>
                    )}
                  </div>
                </div>
                {card.company.isHiring && (
                  <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-900">
                    <Briefcase className="w-3 h-3" /> Hiring
                  </span>
                )}
                <CopyMetaButton
                  card={card}
                  className="shrink-0 -mt-0.5 text-[var(--ink-4)] hover:text-[var(--teal)]"
                />
              </div>

              {/* Role */}
              <div className="px-4 py-3 border-b border-[var(--border)]">
                {card.job ? (
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs text-[var(--ink-4)] uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <Briefcase className="w-3 h-3" /> Open Role
                      </p>
                      <SaveJobButton jobId={card.job.id} className="text-[var(--ink-4)] hover:text-[var(--teal)]" />
                    </div>
                    <p className="font-semibold text-[var(--ink)] text-sm leading-snug">{card.job.title}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {card.job.skills.slice(0, 4).map((skill, idx) => (
                        <span
                          key={`${skill}-${idx}`}
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-[var(--border)] text-[var(--ink-3)] bg-[var(--bg-alt)]"
                        >
                          {skill}
                        </span>
                      ))}
                      {card.job.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium border border-[var(--border)] text-[var(--ink-4)] bg-[var(--bg-alt)]">
                          +{card.job.skills.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[var(--ink-4)] italic">No open roles — exploratory outreach</p>
                )}
              </div>

              {/* Founders */}
              <div className="flex-1">
                <p className="px-4 pt-3 text-xs text-[var(--ink-4)] uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Users className="w-3 h-3" /> {card.founders.length > 1 ? 'Founders' : 'Founder'}
                </p>
                {card.founders.map((f) => (
                  <div key={f.founderId} className="px-4 py-3 flex flex-col gap-2 border-t border-[var(--border)]">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 border border-[var(--border)] shrink-0">
                        {f.founder.avatarUrl && (
                          <AvatarImage src={f.founder.avatarUrl} alt={f.founder.fullName} className="object-cover" />
                        )}
                        <AvatarFallback className="text-xs font-semibold">
                          {f.founder.firstName?.[0]}{f.founder.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1 flex items-center gap-2">
                        <p className="text-sm font-semibold text-[var(--ink)] truncate">{f.founder.fullName}</p>
                        <span className="text-[10px] text-[var(--ink-4)] whitespace-nowrap">{f.email.address}</span>
                        <CopyButton
                          text={f.email.address}
                          className="text-[var(--ink-4)] hover:text-[var(--teal)]"
                        />
                      </div>
                      {f.founder.linkedin && (
                        <a
                          href={f.founder.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="shrink-0 p-1.5 rounded-full text-[var(--ink-4)] hover:text-[#0A66C2] hover:bg-[var(--bg-alt)] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    {f.founder.bio && (
                      <div className="flex items-start justify-between gap-2">
                        <div className="text-xs text-[var(--ink-4)] leading-snug line-clamp-4 flex-1">
                          <Markdown content={f.founder.bio} />
                        </div>
                        <CopyButton
                          text={f.founder.bio}
                          className="-mt-0.5 text-[var(--ink-4)] hover:text-[var(--teal)]"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs text-[var(--ink-3)] leading-snug line-clamp-3 border-l-2 border-[var(--border)] pl-2 flex-1">
                        <Markdown content={f.outreach.message ?? ''} />
                      </div>
                      <CopyButton
                        text={f.outreach.message ?? ''}
                        className="text-[var(--ink-4)] hover:text-[var(--teal)]"
                      />
                    </div>
                    <button
                      onClick={() => setCompose({ card, founder: f })}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold bg-[var(--ink)] text-white hover:bg-[var(--teal)] transition-colors shadow-sm"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      Customize & Send DM
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        {isFetchingMore && (
          <div className="flex justify-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Filter / Control Bar */}
      <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--bg-alt)]/80 backdrop-blur-sm flex items-center gap-3 shrink-0">
        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] shrink-0">
          <button
            onClick={() => setViewMode('deck')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'deck'
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Deck
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-[var(--ink)] text-white shadow-sm'
                : 'text-[var(--ink-3)] hover:text-[var(--ink)]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> List
          </button>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-4)]" />
          <input
            type="text"
            placeholder="Search companies, jobs..."
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--teal)] transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Has Job filter */}
        <button
          onClick={() => setHasJob(v => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
            hasJob
              ? 'bg-[var(--teal)] text-white border-[var(--teal)]'
              : 'border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--teal)] hover:text-[var(--teal)]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" /> Has Job
        </button>

        {/* Card counter */}
        {cards.length > 0 && viewMode === 'deck' && (
          <span className="text-xs text-[var(--ink-4)] shrink-0 ml-auto">
            {currentIndex + 1} / {cards.length}{hasNext ? '+' : ''}
          </span>
        )}
        {cards.length > 0 && viewMode === 'list' && (
          <span className="text-xs text-[var(--ink-4)] shrink-0 ml-auto">
            {cards.length}{hasNext ? '+' : ''} prospects
          </span>
        )}
      </div>

      {/* Main Content */}
      <div className={`flex-1 relative overflow-hidden ${viewMode === 'deck' ? 'flex items-center justify-center bg-muted/10' : ''}`}>
        {loading && cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading prospects...</p>
          </div>
        ) : error && cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 max-w-md mx-auto">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        ) : viewMode === 'deck' ? (
          renderDeck()
        ) : (
          renderList()
        )}

        {/* Deck: loading more indicator */}
        {viewMode === 'deck' && isFetchingMore && cards.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
          </div>
        )}
      </div>

      {/* List view compose modal */}
      {compose && (
        <ComposeDM
          card={compose.card}
          founder={compose.founder}
          onClose={() => setCompose(null)}
          onSent={() => setCompose(null)}
        />
      )}
    </div>
  );
}
