export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type LocationType = 'remote' | 'hybrid' | 'onsite';
export type Stage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';

export interface Job {
  id: number | string;
  title: string;
  company: {
    id: number | string;
    name: string;
    logoUrl?: string;
    batch?: string;
  };
  location?: string | null;
  remote?: boolean;
  type?: JobType;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  equity?: {
    min?: number;
    max?: number;
  };
  experience?: {
    minYears?: number;
  };
  techStack?: string[];
  description?: string;
  requirements?: string[];
  responsibilities?: string[];
  createdAt: string;
  stage?: Stage;
  industry?: string;
  matchPercentage?: number;
}

export interface JobFilters {
  search?: string;
  location?: string;
  locationType?: LocationType[];
  stage?: Stage[];
  industry?: string[];
  techStack?: string[];
  salaryMin?: number;
  salaryMax?: number;
}
