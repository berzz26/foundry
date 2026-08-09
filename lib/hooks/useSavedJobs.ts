'use client';

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { savedJobsService } from '@/lib/services/savedJobs';
import { useSavedJobsStore } from '@/lib/store/savedJobs';

export const SAVED_JOBS_KEY = ['saved-jobs'];

export function useSavedJobs() {
  const query = useQuery({
    queryKey: SAVED_JOBS_KEY,
    queryFn: savedJobsService.getSavedJobs,
  });
  const setIds = useSavedJobsStore((s) => s.setIds);

  useEffect(() => {
    if (query.data) setIds(query.data.map((j) => String(j.id)));
  }, [query.data, setIds]);

  return query;
}

export function useIsJobSaved(jobId: number | string) {
  return useSavedJobsStore((s) => s.ids.includes(String(jobId)));
}

export function useSaveJob() {
  const queryClient = useQueryClient();
  const addId = useSavedJobsStore((s) => s.addId);

  return useMutation({
    mutationFn: savedJobsService.saveJob,
    onSuccess: (_data, jobId) => {
      addId(String(jobId));
      queryClient.invalidateQueries({ queryKey: SAVED_JOBS_KEY });
    },
  });
}

export function useUnsaveJob() {
  const queryClient = useQueryClient();
  const removeId = useSavedJobsStore((s) => s.removeId);

  return useMutation({
    mutationFn: savedJobsService.unsaveJob,
    onSuccess: (_data, jobId) => {
      removeId(String(jobId));
      queryClient.invalidateQueries({ queryKey: SAVED_JOBS_KEY });
    },
  });
}

export function useToggleSaveJob() {
  const save = useSaveJob();
  const unsave = useUnsaveJob();
  const saved = useSavedJobsStore((s) => s.ids);

  return {
    toggle: (jobId: number | string) => {
      const isSaved = saved.includes(String(jobId));
      if (isSaved) unsave.mutate(jobId);
      else save.mutate(jobId);
    },
    isPending: save.isPending || unsave.isPending,
  };
}
