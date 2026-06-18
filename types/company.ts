import type { Stage } from './job';

export interface Founder {
  id: string | number;
  name?: string; // from mock
  fullName?: string; // from API
  firstName?: string;
  lastName?: string;
  role?: string;
  avatar?: string;
  avatarUrl?: string;
  avatarThumb?: string;
  linkedin?: string;
  twitter?: string;
}

export interface Company {
  id: string;
  name: string;
  tagline: string;
  description: string;
  companyDescription?: string;
  logo?: string;
  smallLogoUrl?: string;
  website?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  stage: Stage;
  batch?: string;
  industry: string;
  location: string;
  remoteFriendly: boolean;
  techStack: string[];
  openRoles: number;
  founders: Founder[];
  hiringDescription?: string;
  employeeCount?: string;
  foundedYear?: number;
}

export interface CompaniesMeta {
  batches: string[];
  industries: string[];
  stages: string[];
  totalCompanies: number;
}

export interface CompanyFilters {
  search?: string;
  batch?: string[];
  stage?: Stage[];
  industry?: string[];
  remoteFriendly?: boolean; // We might keep this locally if we want, or map to location? The prompt didn't say backend supports remoteFriendly directly, but we can pass location.
  location?: string;
  country?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  sort?: string;
  limit?: number;
  offset?: number;
}
