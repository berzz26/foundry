import { useQuery } from '@tanstack/react-query';
import { jobsService, GetJobsParams } from '@/lib/services/jobs';

export const useJobs = (params?: GetJobsParams) => {
  return useQuery({
    queryKey: ['jobs', params],
    queryFn: () => jobsService.getJobs(params),
  });
};

export const useFeaturedJobs = () => {
  return useQuery({
    queryKey: ['jobs', 'featured'],
    queryFn: () => jobsService.getFeaturedJobs(),
  });
};

export const useJob = (id: string | number) => {
  return useQuery({
    queryKey: ['jobs', id],
    queryFn: () => jobsService.getJobById(id),
    enabled: !!id,
  });
};

export const useRelatedJobs = (id: string | number) => {
  return useQuery({
    queryKey: ['jobs', id, 'related'],
    queryFn: () => jobsService.getRelatedJobs(id),
    enabled: !!id,
  });
};
