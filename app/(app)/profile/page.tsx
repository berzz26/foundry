'use client';

import { motion } from 'framer-motion';
import { User as UserIcon, MapPin, Globe, Mail, Edit2, Code2, Briefcase } from 'lucide-react';
import { SectionReveal } from '@/components/animations';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PROFILE = {
  name: 'Alex Engineer',
  email: 'alex@example.com',
  location: 'San Francisco, CA',
  website: 'https://alexengineer.dev',
  bio: 'Senior backend engineer passionate about distributed systems, open-source tooling, and developer experience. 5 years building production infrastructure.',
  skills: ['TypeScript', 'Go', 'Rust', 'React', 'PostgreSQL', 'Kubernetes', 'gRPC'],
  experience: [
    { role: 'Senior Backend Engineer', company: 'FinTech Startup', duration: '2021 — Present' },
    { role: 'Software Engineer', company: 'TechCorp', duration: '2019 — 2021' },
  ],
  preferences: {
    jobTypes: ['Full-time'],
    locationTypes: ['Remote', 'Hybrid'],
    minSalary: 150000,
    stages: ['Seed', 'Series A', 'Series B'],
  },
};

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <div className="p-6 text-center text-[var(--ink-3)]">Loading profile...</div>;
  }

  const displayName = user.firstName 
    ? `${user.firstName} ${user.lastName || ''}`.trim() 
    : user.email.split('@')[0];

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Profile Card */}
      <motion.div className="card-double-border p-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt={displayName} className="w-16 h-16 rounded-full object-cover shrink-0 border border-[var(--border)]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-2xl font-semibold shrink-0">
                {displayName[0].toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-2xl text-[var(--ink)]">{displayName}</h2>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-[var(--bg-alt)] border border-[var(--border)] rounded-full text-[var(--ink-3)]">
                  {user.role}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-sm text-[var(--ink-3)]">
                  <MapPin className="w-3.5 h-3.5" />
                  {PROFILE.location}
                </div>
                <div className="flex items-center gap-1 text-sm text-[var(--ink-3)]">
                  <Globe className="w-3.5 h-3.5" />
                  <a href={PROFILE.website} className="hover:text-[var(--teal)] transition-colors">{PROFILE.website.replace('https://', '')}</a>
                </div>
              </div>
            </div>
          </div>
          <button id="edit-profile-btn" className="flex items-center gap-1.5 px-3 py-2 text-sm border border-[var(--border)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all rounded">
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
        <p className="text-sm text-[var(--ink-2)] leading-relaxed">{PROFILE.bio}</p>
      </motion.div>

      {/* Skills */}
      <SectionReveal delay={0.05}>
        <div className="card-double-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-4 h-4 text-[var(--teal)]" />
            <h3 className="font-serif text-lg text-[var(--ink)]">Skills</h3>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PROFILE.skills.map(s => <span key={s} className="tech-badge">{s}</span>)}
          </div>
        </div>
      </SectionReveal>

      {/* Experience */}
      <SectionReveal delay={0.1}>
        <div className="card-double-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-4 h-4 text-[var(--teal)]" />
            <h3 className="font-serif text-lg text-[var(--ink)]">Experience</h3>
          </div>
          <div className="flex flex-col gap-4">
            {PROFILE.experience.map(e => (
              <div key={e.role} className="flex items-start justify-between border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium text-[var(--ink)] text-sm">{e.role}</p>
                  <p className="text-sm text-[var(--ink-3)]">{e.company}</p>
                </div>
                <span className="text-xs font-mono text-[var(--ink-4)] shrink-0 ml-4">{e.duration}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Job Preferences */}
      <SectionReveal delay={0.15}>
        <div className="card-double-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <UserIcon className="w-4 h-4 text-[var(--teal)]" />
            <h3 className="font-serif text-lg text-[var(--ink)]">Job Preferences</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Job Type', value: PROFILE.preferences.jobTypes.join(', ') },
              { label: 'Location', value: PROFILE.preferences.locationTypes.join(', ') },
              { label: 'Min Salary', value: `$${(PROFILE.preferences.minSalary / 1000).toFixed(0)}k/yr` },
              { label: 'Company Stage', value: PROFILE.preferences.stages.join(', ') },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-0.5">{label}</p>
                <p className="text-sm text-[var(--ink-2)]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* Contact */}
      <SectionReveal delay={0.2}>
        <div className="card-double-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4 text-[var(--teal)]" />
            <h3 className="font-serif text-lg text-[var(--ink)]">Contact</h3>
          </div>
          <p className="text-sm text-[var(--ink-2)]">{user.email}</p>
          <p className="text-xs text-[var(--ink-4)] mt-2">Provider: <span className="capitalize">{user.provider}</span></p>
          {/* NOTE: TODO(security) When auth is added, mask email display in non-owner views */}
        </div>
      </SectionReveal>
    </div>
  );
}
