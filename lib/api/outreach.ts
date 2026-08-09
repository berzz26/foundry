import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

axios.defaults.withCredentials = true;

export type SwipeCard = {
  outreachId: number;
  founderId: number;
  company: {
    id: number; name: string; batch?: string | null; tagline?: string | null;
    description?: string | null; hiringDescription?: string | null;
    logoUrl?: string | null; website?: string | null; location?: string | null;
    industry?: string | null; stage?: string | null; teamSize?: number | null;
    isHiring: boolean;
  };
  founder: {
    id: number; companyId?: number | null; fullName: string; firstName?: string | null;
    lastName?: string | null; bio?: string | null; linkedin?: string | null;
    twitter?: string | null; avatarUrl?: string | null;
  };
  email: { address: string; confidence?: number | null; smtpValid?: boolean | null;
           catchAll?: boolean | null; verificationResponse?: string | null; };
  job?: null | {
    id: number; title: string; role?: string | null; description?: string | null;
    location?: string | null; remote?: string | null; salaryMin?: number | null;
    salaryMax?: number | null; equityMin?: number | null; equityMax?: number | null;
    visaRequired?: string | null; jobUrl?: string | null; skills: string[];
    interviewProcess?: string | null; minExperience?: number | null;
    timeToHire?: number | null; prettyEngType?: string | null; createdAt?: string | null;
  };
  outreach: {
    subject?: string | null; message?: string | null; role?: string | null;
    generatedAt?: string | null;
  };
  contactable: boolean;
};

export type FounderRecipient = {
  founderId: number;
  founder: SwipeCard['founder'];
  email: SwipeCard['email'];
  outreach: SwipeCard['outreach'];
  contactable: boolean;
};

export type DeckCard = {
  outreachId: number;
  company: SwipeCard['company'];
  job: SwipeCard['job'];
  founders: FounderRecipient[];
};

export function groupOutreachCards(cards: SwipeCard[]): DeckCard[] {
  const map = new Map<number, DeckCard>();
  for (const card of cards) {
    let entry = map.get(card.outreachId);
    if (!entry) {
      entry = {
        outreachId: card.outreachId,
        company: card.company,
        job: card.job,
        founders: [],
      };
      map.set(card.outreachId, entry);
    }
    const existing = entry.founders.some(f => f.founderId === card.founderId);
    if (!existing) {
      entry.founders.push({
        founderId: card.founderId,
        founder: card.founder,
        email: card.email,
        outreach: card.outreach,
        contactable: card.contactable,
      });
    }
  }
  return [...map.values()];
}

export type OutreachResponse = {
  cards: SwipeCard[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasNext: boolean;
  };
};

export async function getOutreachCards(limit: number = 10, offset: number = 0, companyId?: string, search?: string, hasJob?: boolean): Promise<OutreachResponse> {
  const params = new URLSearchParams();
  params.append('limit', String(limit));
  params.append('offset', String(offset));
  if (companyId) params.append('companyId', companyId);
  if (search) params.append('search', search);
  if (hasJob !== undefined) params.append('hasJob', String(hasJob));

  const res = await axios.get(`${API_BASE_URL}/outreach?${params.toString()}`);
  return res.data;
}

export type SendOutreachPayload = {
  subject?: string;
  message: string;
  to?: string;
  founderId?: number;
};

export async function sendOutreachMessage(outreachId: number, payload: SendOutreachPayload) {
  const res = await axios.post(`${API_BASE_URL}/outreach/${outreachId}/send`, payload);
  return res.data;
}
