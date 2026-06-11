import axios from 'axios';
import { DUMMY_JOBS } from '@/lib/dummy-data/jobs';
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
  
  // If formatted as a bulleted/numbered/newline list
  const lines = techStackStr.split(/[\r\n]+/);
  const items = lines
    .map(l => l.replace(/^[•\-\*\s\d\.]+/, '').trim())
    .filter(l => l.length > 0);

  // If it behaves like a list of skills (short items, few words per line)
  const looksLikeList = items.length > 0 && items.every(item => item.length < 50 && item.split(' ').length <= 4);
  if (looksLikeList) {
    return items.flatMap(item => {
      if (item.includes(',')) {
        return item.split(',').map(s => s.trim());
      }
      return [item];
    });
  }

  // If it's a paragraph or custom description, scan/match common technologies
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

function mapApiCompanyToCompany(c: any): Company {
  const numId = Number(c.id) || 0;

  // Distribute stage evenly across companies based on ID
  const stages: Stage[] = ['pre-seed', 'seed', 'series-a', 'series-b'];
  const stage = stages[numId % stages.length];
  const fixedUrl = c.logoUrl?.replace(/\\u0026/g, "&");

  // Assign mock founders based on ID
  const founders = [
    MOCK_FOUNDERS[numId % MOCK_FOUNDERS.length],
    MOCK_FOUNDERS[(numId + 1) % MOCK_FOUNDERS.length],
  ];

  return {
    id: String(c.id),
    name: c.name || '',
    tagline: c.tagline || '',
    description: c.description || '',
    logo: fixedUrl,
    website: c.website || undefined,
    stage,
    batch: c.batch || undefined,
    industry: c.industry || c.childSector || c.parentSector || 'Other',
    location: c.location || 'San Francisco, CA',
    remoteFriendly: c.location?.toLowerCase().includes('remote') || (numId % 2 === 0),
    techStack: parseTechStack(c.techStack),
    openJobsCount: DUMMY_JOBS.filter(j => j.companyId === String(c.id)).length,
    founders,
    hiringDescription: c.hiringDescription || undefined,
    employeeCount: c.teamSize ? String(c.teamSize) : '1-10',
    foundedYear: c.createdAt ? new Date(c.createdAt).getFullYear() : 2024,
  };
}

// Simulated network delay for realistic UX (jobs/resume match only)
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

// ─── Jobs ────────────────────────────────────────────────────────────────────

export async function getJobs(filters?: JobFilters): Promise<{ jobs: Job[]; total: number }> {
  await delay(400);
  let jobs = [...DUMMY_JOBS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    jobs = jobs.filter(
      j =>
        j.title.toLowerCase().includes(q) ||
        j.companyName.toLowerCase().includes(q) ||
        j.techStack.some(t => t.toLowerCase().includes(q))
    );
  }
  if (filters?.locationType?.length) {
    jobs = jobs.filter(j => filters.locationType!.includes(j.locationType));
  }
  if (filters?.stage?.length) {
    jobs = jobs.filter(j => j.stage && filters.stage!.includes(j.stage));
  }
  if (filters?.industry?.length) {
    jobs = jobs.filter(j => j.industry && filters.industry!.includes(j.industry));
  }
  if (filters?.techStack?.length) {
    jobs = jobs.filter(j => filters.techStack!.some(t => j.techStack.includes(t)));
  }

  return { jobs, total: jobs.length };
}

export async function getJobById(id: string): Promise<Job | null> {
  await delay(200);
  return DUMMY_JOBS.find(j => j.id === id) ?? null;
}

// ─── Companies ───────────────────────────────────────────────────────────────

export async function getCompanies(
  filters?: CompanyFilters
): Promise<{ companies: Company[]; total: number }> {
  try {
    const res = await axios.get(`${API_BASE_URL}/companies`);
    const data = res.data;
    let companies = data.map(mapApiCompanyToCompany);

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      companies = companies.filter(
        (c: Company) =>
          c.name.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q)
      );
    }
    if (filters?.stage?.length) {
      companies = companies.filter((c: Company) => filters.stage!.includes(c.stage));
    }
    if (filters?.industry?.length) {
      companies = companies.filter((c: Company) => filters.industry!.includes(c.industry));
    }
    if (filters?.batch?.length) {
      companies = companies.filter((c: Company) => c.batch && filters.batch!.includes(c.batch));
    }
    if (filters?.remoteFriendly) {
      companies = companies.filter((c: Company) => c.remoteFriendly);
    }

    return { companies, total: companies.length };
  } catch (error) {
    console.error('getCompanies error:', error);
    return { companies: [], total: 0 };
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

export async function getJobsByCompanyId(companyId: string): Promise<Job[]> {
  return DUMMY_JOBS.filter(j => j.companyId === companyId);
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
  const matched = DUMMY_JOBS
    .filter(j => j.matchPercentage !== undefined)
    .sort((a, b) => (b.matchPercentage ?? 0) - (a.matchPercentage ?? 0));
  return {
    score: 87,
    matches: matched.length,
    topSkills: ['TypeScript', 'Go', 'Distributed Systems', 'PostgreSQL', 'React'],
    matchedJobs: matched,
  };
}

