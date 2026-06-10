export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type LocationType = 'remote' | 'hybrid' | 'onsite';
export type Stage = 'pre-seed' | 'seed' | 'series-a' | 'series-b' | 'series-c' | 'growth';

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  locationType: LocationType;
  type: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  techStack: string[];
  description: string;
  requirements: string[];
  responsibilities: string[];
  postedAt: string;
  batch?: string;
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
