import { DUMMY_JOBS } from '@/lib/dummy-data/jobs';
import type { Job, JobFilters } from '@/types/job';
import { DUMMY_COMPANIES } from '@/lib/dummy-data/companies';
import type { Company, CompanyFilters } from '@/types/company';

// Simulated network delay for realistic UX
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
  await delay(400);
  let companies = [...DUMMY_COMPANIES];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    companies = companies.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q)
    );
  }
  if (filters?.stage?.length) {
    companies = companies.filter(c => filters.stage!.includes(c.stage));
  }
  if (filters?.industry?.length) {
    companies = companies.filter(c => filters.industry!.includes(c.industry));
  }
  if (filters?.batch?.length) {
    companies = companies.filter(c => c.batch && filters.batch!.includes(c.batch));
  }
  if (filters?.remoteFriendly) {
    companies = companies.filter(c => c.remoteFriendly);
  }

  return { companies, total: companies.length };
}

export async function getCompanyById(id: string): Promise<Company | null> {
  await delay(200);
  return DUMMY_COMPANIES.find(c => c.id === id) ?? null;
}

export async function getJobsByCompanyId(companyId: string): Promise<Job[]> {
  await delay(200);
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
