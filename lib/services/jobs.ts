import axios from 'axios';
import type { Job } from '@/types/job';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1',
});

export interface GetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNext: boolean;
  };
}

export const jobsService = {
  getJobs: async (params?: GetJobsParams): Promise<JobsResponse> => {
    const { data } = await api.get('/jobs', { params });
    return data;
  },

  getFeaturedJobs: async (): Promise<JobsResponse> => {
    const { data } = await api.get('/jobs/featured');
    return data;
  },

  getJobById: async (id: string | number): Promise<Job> => {
    const { data } = await api.get(`/jobs/${id}`);
    return data;
  },

  getRelatedJobs: async (id: string | number): Promise<JobsResponse> => {
    const { data } = await api.get(`/jobs/${id}/related`);
    return data;
  }
};
