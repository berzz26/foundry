import axios from 'axios';
import type { Job, JobFilters, Stage } from '@/types/job';
import type { Company, CompanyFilters, Founder } from '@/types/company';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const MOCK_FOUNDERS: Founder[] = [
  { id: 'f1', name: 'Arjun Mehta', role: 'CEO & Co-founder', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  { id: 'f2', name: 'Priya Sharma', role: 'CTO & Co-founder', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  { id: 'f3', name: 'Wei Zhang', role: 'CEO & Founder', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  { id: 'f4', name: 'Lucas Fernandez', role: 'CEO', linkedin: 'https://linkedin.com' },
  { id: 'f5', name: 'Anika Patel', role: 'CTO', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  { id: 'f6', name: 'Omar Hassan', role: 'CEO & Co-founder', linkedin: 'https://linkedin.com' },
  { id: 'f7', name: 'Sophie Lefebvre', role: 'CTO & Co-founder', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
  { id: 'f8', name: 'Ravi Kumar', role: 'CEO', linkedin: 'https://linkedin.com', twitter: 'https://twitter.com' },
];

export function parseTechStack(techStackStr: string | undefined | null): string[] {
  if (!techStackStr) return [];

  const lines = techStackStr.split(/[\r\n]+/);
  const items = lines
    .map(l => l.replace(/^[•\-\*\s\d\.]+/, '').trim())
    .filter(l => l.length > 0);

  const looksLikeList = items.length > 0 && items.every(item => item.length < 50 && item.split(' ').length <= 4);
  if (looksLikeList) {
    return items.flatMap(item => {
      if (item.includes(',')) {
        return item.split(',').map(s => s.trim());
      }
      return [item];
    });
  }

  const commonTech = [
    'React', 'Next.js', 'TypeScript', 'JavaScript', 'Node.js', 'Go', 'Golang', 'Rust',
    'Python', 'Django', 'FastAPI', 'Flask', 'Ruby', 'Rails', 'Java', 'Spring', 'Kotlin',
    'Swift', 'C++', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'Azure', 'PostgreSQL', 'Postgres',
    'MongoDB', 'Redis', 'Kafka', 'ClickHouse', 'TensorFlow', 'PyTorch', 'LLMs', 'AI', 'GenAI'
  ];
  const found: string[] = [];
  const lower = techStackStr.toLowerCase();
  for (const tech of commonTech) {
    const escaped = tech.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const startBoundary = /^[a-zA-Z0-9]/.test(tech) ? '\\b' : '';
    const endBoundary = /[a-zA-Z0-9]$/.test(tech) ? '\\b' : '';
    const regex = new RegExp(`${startBoundary}${escaped}${endBoundary}`);
    if (regex.test(lower)) {
      found.push(tech);
    }
  }
  if (found.length > 0) return found;

  return ['AI', 'SaaS', 'Web'];
}

/**
 * Strips expired AWS pre-signed query params from S3 logo URLs.
 * Pre-signed URLs expire after their X-Amz-Expires window; stripping the
 * signature makes the URL a plain public object URL (works if the bucket
 * allows public reads, which YC's bookface-images bucket does for logos).
 */
function cleanLogoUrl(url: string | undefined | null): string | undefined {
  if (!url) return undefined;
  // Unescape unicode-escaped ampersands that sometimes come from the API
  const fixed = url.replace(/\\u0026/g, '&');
  try {
    const parsed = new URL(fixed);
    if (parsed.searchParams.has('X-Amz-Signature')) {
      parsed.search = '';
      return parsed.toString();
    }
    return fixed;
  } catch {
    return fixed;
  }
}

function mapApiCompanyToCompany(c: any): Company {
  const numId = Number(c.id) || 0;

  const stages: Stage[] = ['pre-seed', 'seed', 'series-a', 'series-b'];
  const stage = stages[numId % stages.length];

  const founders = [
    MOCK_FOUNDERS[numId % MOCK_FOUNDERS.length],
    MOCK_FOUNDERS[(numId + 1) % MOCK_FOUNDERS.length],
  ];

  return {
    id: String(c.id),
    name: c.name || '',
    tagline: c.tagline || '',
    description: c.description || '',
    logo: cleanLogoUrl(c.sourceLogoUrl || c.logoUrl),
    smallLogoUrl: c.sourceSmallLogoUrl || c.smallLogoUrl,
    website: c.website || undefined,
    stage,
    batch: c.batch || undefined,
    industry: c.industry || c.childSector || c.parentSector || 'Other',
    location: c.location || 'San Francisco, CA',
    remoteFriendly: c.location?.toLowerCase().includes('remote') || (numId % 2 === 0),
    techStack: parseTechStack(c.techStack),
    openJobsCount: c.openJobsCount || 0,
    founders,
    hiringDescription: c.hiringDescription || undefined,
    employeeCount: c.teamSize ? String(c.teamSize) : '1-10',
    foundedYear: c.createdAt ? new Date(c.createdAt).getFullYear() : 2024,
  };
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ─── Jobs ────────────────────────────────────────────────────────────────────

export async function getJobs(filters?: JobFilters & { limit?: number; offset?: number }): Promise<{ jobs: Job[]; total: number }> {
  try {
    const params = new URLSearchParams();
    if (filters?.limit) params.append('limit', String(filters.limit));
    else params.append('limit', '50');
    if (filters?.offset) params.append('offset', String(filters.offset));

    // Handle string fields
    if (filters?.search) params.append('search', filters.search);
    if (filters?.location) params.append('location', filters.location);

    // Arrays
    if (filters?.locationType?.length) {
      filters.locationType.forEach(lt => params.append('locationType', lt));
    }
    if (filters?.stage?.length) {
      filters.stage.forEach(s => params.append('stage', s));
    }
    if (filters?.industry?.length) {
      filters.industry.forEach(i => params.append('industry', i));
    }
    if (filters?.techStack?.length) {
      filters.techStack.forEach(t => params.append('techStack', t));
    }

    const res = await axios.get(`${API_BASE_URL}/jobs?${params.toString()}`);
    return { jobs: res.data.jobs || [], total: res.data.pagination?.total || 0 };
  } catch (error) {
    console.error('getJobs error:', error);
    return { jobs: [], total: 0 };
  }
}

export async function getJobById(id: string | number): Promise<Job | null> {
  try {
    const res = await axios.get(`${API_BASE_URL}/jobs/${id}`);
    return res.data;
  } catch (error) {
    console.error(`getJobById(${id}) error:`, error);
    return null;
  }
}

// ─── Companies ───────────────────────────────────────────────────────────────

export async function getCompanies(
  filters?: CompanyFilters
): Promise<{ companies: Company[]; total: number }> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.limit) params.append('limit', String(filters.limit));
    else params.append('limit', '20');
    
    if (filters?.offset) params.append('offset', String(filters.offset));
    else params.append('offset', '0');

    if (filters?.search) params.append('search', filters.search);
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.minTeamSize !== undefined) params.append('minTeamSize', String(filters.minTeamSize));
    if (filters?.maxTeamSize !== undefined) params.append('maxTeamSize', String(filters.maxTeamSize));

    // Handle arrays by appending multiple times
    if (filters?.stage?.length) {
      filters.stage.forEach(s => params.append('stage', s));
    }
    if (filters?.industry?.length) {
      filters.industry.forEach(i => params.append('industry', i));
    }
    if (filters?.batch?.length) {
      filters.batch.forEach(b => params.append('batch', b));
    }

    const res = await axios.get(`${API_BASE_URL}/companies?${params.toString()}`);
    const data = res.data;
    let companies = data.map(mapApiCompanyToCompany);

    // Apply any local fallback filters if backend doesn't support them fully
    if (filters?.remoteFriendly) {
      companies = companies.filter((c: Company) => c.remoteFriendly);
    }

    return { companies, total: companies.length };
  } catch (error) {
    console.error('getCompanies error:', error);
    return { companies: [], total: 0 };
  }
}

export interface CompaniesMeta {
  batches: string[];
  industries: string[];
  stages: string[];
}

export async function getCompaniesMeta(): Promise<CompaniesMeta | null> {
  try {
    const res = await axios.get(`${API_BASE_URL}/companies/meta`);
    return res.data;
  } catch (error) {
    console.error('getCompaniesMeta error:', error);
    return null;
  }
}

export async function getCompanyById(id: string): Promise<Company | null> {
  try {
    const res = await axios.get(`${API_BASE_URL}/companies/${id}`);
    const data = res.data;
    return mapApiCompanyToCompany(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error(`getCompanyById(${id}) error:`, error);
    return null;
  }
}

export async function getJobsByCompanyId(companyId: string | number): Promise<Job[]> {
  try {
    const res = await axios.get(`${API_BASE_URL}/jobs?companyId=${companyId}`);
    return res.data.jobs || [];
  } catch (error) {
    return [];
  }
}

// ─── Resume Match ─────────────────────────────────────────────────────────────

export interface ResumeMatchResult {
  score: number;
  matches: number;
  topSkills: string[];
  matchedJobs: Job[];
}

export async function getResumeMatches(): Promise<ResumeMatchResult> {
  await delay(1500);
  let matched: Job[] = [];
  try {
    const res = await getJobs({ limit: 5 });
    matched = res.jobs.map(j => ({ ...j, matchPercentage: Math.floor(Math.random() * 20) + 80 }));
  } catch (error) {
    console.error(error);
  }
  
  return {
    score: 87,
    matches: matched.length,
    topSkills: ['TypeScript', 'Go', 'Distributed Systems', 'PostgreSQL', 'React'],
    matchedJobs: matched,
  };
}