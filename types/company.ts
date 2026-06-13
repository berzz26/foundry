import type { Stage } from './job';

export interface Founder {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  linkedin?: string;
  twitter?: string;
  // NOTE: email intentionally omitted in V1
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo?: string;
  smallLogoUrl?: string;
  website?: string;
  stage: Stage;
  batch?: string;
  industry: string;
  location: string;
  remoteFriendly: boolean;
  techStack: string[];
  openJobsCount: number;
  founders: Founder[];
  hiringDescription?: string;
  employeeCount?: string;
  foundedYear?: number;
}

export interface CompanyFilters {
  search?: string;
  batch?: string[];
  stage?: Stage[];
  industry?: string[];
  remoteFriendly?: boolean;
  limit?: number;
  offset?: number;
}
