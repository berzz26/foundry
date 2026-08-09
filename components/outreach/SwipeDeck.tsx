"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { getOutreachCards, SwipeCard as SwipeCardType } from '@/lib/api/outreach';
import { SwipeCard } from './SwipeCard';
import { Loader2, RefreshCcw, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import { AnimatePresence, motion } from 'framer-motion';

export function SwipeDeck() {
  const [cards, setCards] = useState<SwipeCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [offset, setOffset] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  
  const [search, setSearch] = useState('');
  const [hasJob, setHasJob] = useState(false);
  const limit = 10;

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
      
      if (reset) {
        setCards(res.cards);
        setCurrentIndex(0);
      } else {
        setCards(prev => [...prev, ...res.cards]);
      }
      
      setOffset(res.pagination.offset + limit);
      setHasNext(res.pagination.hasNext);
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
  }, [search, hasJob]); // refetch on filter change

  // Refetch more if stack gets small
  useEffect(() => {
    if (cards.length - currentIndex < 3 && hasNext && !isFetchingMore && !loading) {
      fetchCards(false);
    }
  }, [cards.length, currentIndex, hasNext, isFetchingMore, loading, fetchCards]);

  const handleSwipe = () => {
    setCurrentIndex(prev => prev + 1);
  };
  
  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };

  const handleRetry = () => {
    fetchCards(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Filter Bar */}
      <div className="p-4 border-b border-border bg-background/95 flex items-center justify-between gap-4 shrink-0">
        <div className="flex-1 max-w-sm relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search companies, jobs..." 
            className="pl-9 bg-muted/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Toggle 
            pressed={hasJob} 
            onPressedChange={setHasJob}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Filter className="w-4 h-4" /> Has Job
          </Toggle>
        </div>
      </div>

      {/* Deck Area */}
      <div className="flex-1 relative flex items-center justify-center bg-muted/20 overflow-hidden perspective-1000">
        {loading && cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
            <p>Loading prospects...</p>
          </div>
        ) : error && cards.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <RefreshCcw className="w-8 h-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Something went wrong</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={handleRetry}>Try Again</Button>
          </div>
        ) : cards.length === 0 || currentIndex >= cards.length ? (
          <div className="flex flex-col items-center justify-center text-center p-6 max-w-md">
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
        ) : (
          <div className="relative w-full max-w-[420px] md:max-w-4xl h-[750px] max-h-[85vh] md:h-[650px] flex items-center justify-center">
            
            {/* Desktop Navigation Buttons */}
            <div className="absolute -left-16 lg:-left-24 hidden md:flex items-center justify-center z-20">
              <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="w-12 h-12 rounded-full shadow-md bg-background/80 backdrop-blur border-border hover:bg-background">
                <ChevronLeft className="w-6 h-6" />
              </Button>
            </div>
            
            <div className="absolute -right-16 lg:-right-24 hidden md:flex items-center justify-center z-20">
              <Button variant="outline" size="icon" onClick={() => handleSwipe()} disabled={currentIndex >= cards.length} className="w-12 h-12 rounded-full shadow-md bg-background/80 backdrop-blur border-border hover:bg-background">
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>

            <div className="relative w-full h-full">
              <AnimatePresence>
                {/* Render the deck backwards so the first card is on top visually */}
                {cards.slice(currentIndex, currentIndex + 3).reverse().map((card, idx, arr) => {
                const isTop = idx === arr.length - 1;
                const distanceFromTop = arr.length - 1 - idx; // 0 for top, 1 for next, 2 for 3rd
                
                return (
                  <motion.div
                    key={`${card.outreachId}-${card.founderId}`}
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1 - distanceFromTop * 0.04, 
                      y: distanceFromTop * 20,
                      zIndex: 10 - distanceFromTop
                    }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
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
        )}

        {isFetchingMore && cards.length > 0 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm border border-border px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading more...
          </div>
        )}
      </div>
    </div>
  );
}
