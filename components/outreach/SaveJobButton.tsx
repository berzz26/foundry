'use client';

import React from 'react';
import { Bookmark } from 'lucide-react';
import { useIsJobSaved, useSaveJob, useUnsaveJob } from '@/lib/hooks/useSavedJobs';
import { cn } from '@/lib/utils';

interface SaveJobButtonProps {
  jobId: number | string | null | undefined;
  className?: string;
  size?: 'sm' | 'md';
  activeClassName?: string;
  idleClassName?: string;
}

export function SaveJobButton({
  jobId,
  className,
  size = 'sm',
  activeClassName,
  idleClassName,
}: SaveJobButtonProps) {
  const saved = useIsJobSaved(jobId ?? -1);
  const saveMutation = useSaveJob();
  const unsaveMutation = useUnsaveJob();
  const isPending = saveMutation.isPending || unsaveMutation.isPending;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (jobId == null || isPending) return;
    if (saved) unsaveMutation.mutate(jobId);
    else saveMutation.mutate(jobId);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={jobId == null || isPending}
      aria-label={saved ? 'Remove from saved jobs' : 'Save job'}
      title={saved ? 'Saved' : 'Save job'}
      className={cn(
        'flex items-center justify-center rounded border transition-all disabled:opacity-60 shrink-0',
        size === 'sm' ? 'w-7 h-7' : 'w-8 h-8',
        saved
          ? activeClassName ?? 'bg-[var(--teal)] border-[var(--teal)] text-white'
          : idleClassName ?? 'border-[var(--border)] text-[var(--ink-4)] hover:border-[var(--teal)] hover:text-[var(--teal)]',
        className
      )}
    >
      <Bookmark className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'} fill={saved ? 'currentColor' : 'none'} />
    </button>
  );
}
