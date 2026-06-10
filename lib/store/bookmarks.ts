'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkState {
  bookmarked: string[]; // job IDs
  statuses: Record<string, string>; // jobId -> status
  savedDates: Record<string, string>; // jobId -> ISO date string
  toggle: (jobId: string) => void;
  isBookmarked: (jobId: string) => boolean;
  setStatus: (jobId: string, status: string) => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarked: [],
      statuses: {},
      savedDates: {},
      toggle: (jobId) => {
        const { bookmarked } = get();
        const isIn = bookmarked.includes(jobId);
        if (isIn) {
          const next = bookmarked.filter(id => id !== jobId);
          const { statuses, savedDates } = get();
          const ns = { ...statuses };
          const nd = { ...savedDates };
          delete ns[jobId];
          delete nd[jobId];
          set({ bookmarked: next, statuses: ns, savedDates: nd });
        } else {
          set({
            bookmarked: [...bookmarked, jobId],
            savedDates: { ...get().savedDates, [jobId]: new Date().toISOString() },
          });
        }
      },
      isBookmarked: (jobId) => get().bookmarked.includes(jobId),
      setStatus: (jobId, status) =>
        set(s => ({ statuses: { ...s.statuses, [jobId]: status } })),
    }),
    { name: 'foundry-bookmarks' } // NOTE: non-sensitive data only
  )
);
