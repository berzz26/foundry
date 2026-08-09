import axios from 'axios';
import type { Job } from '@/types/job';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

axios.defaults.withCredentials = true;

export interface SavedStatusResponse {
  saved: boolean;
}

export type SavedJobCard = Job & { savedAt: string };

export const savedJobsService = {
  getSavedJobs: async (): Promise<SavedJobCard[]> => {
    const res = await axios.get(`${API_BASE_URL}/saved-jobs`);
    const data = res.data;
    if (Array.isArray(data)) return data;
    return data?.jobs || data?.savedJobs || data?.saved_jobs || [];
  },

  isSaved: async (jobId: number | string): Promise<boolean> => {
    const res = await axios.get<SavedStatusResponse>(`${API_BASE_URL}/saved-jobs/${jobId}`);
    return res.data.saved;
  },

  saveJob: async (jobId: number | string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/saved-jobs`, { jobId: Number(jobId) });
  },

  unsaveJob: async (jobId: number | string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/saved-jobs/${jobId}`);
  },
};
