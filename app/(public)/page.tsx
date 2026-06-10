'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Briefcase, Building2, FileSearch, Users, Zap, Star, TrendingUp } from 'lucide-react';
import { AnimatedCounter, SectionReveal } from '@/components/animations';
import { AnimatedBackground } from '@/components/animations/AnimatedBackground';
import { DottedGlowBackground } from '@/components/ui/dotted-glow-background';
import { DUMMY_COMPANIES } from '@/lib/dummy-data/companies';

const FEATURES = [
  {
    icon: Building2,
    title: 'Explore Startup Companies',
    desc: 'Discover companies raising rounds, their hiring activity, founding team, and tech stack — all in one place.',
  },
  {
    icon: Briefcase,
    title: 'Smart Job Search',
    desc: 'Filter by role, tech stack, stage, batch, salary range, and remote policy. Find the right fit in seconds.',
  },
  {
    icon: FileSearch,
    title: 'Resume Matching',
    desc: 'Upload your resume and get AI-powered job recommendations ranked by match strength and skill overlap.',
  },
  {
    icon: Users,
    title: 'Company Insights',
    desc: 'Understand startups before applying — founders, hiring philosophy, tech choices, and growth signals.',
  },
];

const TESTIMONIALS = [
  {
    quote: 'Found my current role at a Series A startup within 2 weeks. The resume match feature is genuinely impressive.',
    name: 'Alex Chen',
    role: 'Senior Engineer at Novara',
    initials: 'AC',
  },
  {
    quote: 'Unlike other boards, Foundry actually surfaces companies that are a cultural and technical fit.',
    name: 'Priya Iyer',
    role: 'ML Engineer at Pulse Health',
    initials: 'PI',
  },
  {
    quote: 'The YC batch filter alone saved me hours. Got 3 interviews in a week.',
    name: 'Marcus Johnson',
    role: 'Infra Engineer at Helios AI',
    initials: 'MJ',
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate min-h-[90vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">
        {/* Background radial & animation */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <DottedGlowBackground
            className="pointer-events-none mask-radial-to-90% mask-radial-at-center"
            opacity={1}
            gap={10}
            radius={1.6}
            colorLightVar="--color-neutral-500"
            glowColorLightVar="--color-neutral-600"
            colorDarkVar="--color-neutral-500"
            glowColorDarkVar="--color-sky-800"
            backgroundOpacity={0}
            speedMin={0.3}
            speedMax={1.6}
            speedScale={1}
          />
          <AnimatedBackground />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_50%_40%,rgba(13,115,119,0.06),transparent)]" />
          <div className="noise-bg absolute inset-0 opacity-[0.04]" />
        </div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(13,115,119,0.2)] bg-[var(--teal-light)] text-xs font-medium text-[var(--teal)]">
            <Zap className="w-3 h-3" />
            <span>AI-powered resume matching</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-pulse" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[80px] leading-[1.02] tracking-tight max-w-4xl text-[var(--ink)]"
        >
          Find Startup Jobs<br />
          <em className="text-[var(--teal)]">Before Everyone Else</em>
        </motion.h1>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
          className="mt-6 text-lg text-[var(--ink-2)] max-w-xl leading-relaxed"
        >
          Explore startup opportunities, discover companies, and find roles that match your experience.
          Built for engineers who want to join something worth building.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: 'easeOut' }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/jobs"
            id="hero-browse-jobs"
            className="group flex items-center gap-2 px-6 py-3 bg-[var(--ink)] text-white rounded-full font-medium text-sm hover:bg-[var(--teal)] transition-all duration-300"
          >
            Browse Jobs
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/resume-match"
            id="hero-upload-resume"
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--border-strong)] font-medium text-sm text-[var(--ink)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all duration-300"
          >
            Upload Resume
          </Link>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-16 flex items-center gap-8 sm:gap-12 text-center flex-wrap justify-center"
        >
          {[
            { target: 1000, suffix: '+', label: 'Companies' },
            { target: 3000, suffix: '+', label: 'Jobs' },
            { target: 500, suffix: '+', label: 'Founders' },
          ].map(({ target, suffix, label }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-serif text-3xl text-[var(--ink)] font-medium">
                <AnimatedCounter target={target} suffix={suffix} />
              </span>
              <span className="text-xs text-[var(--ink-3)] mt-0.5 uppercase tracking-widest">{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ─── Ticker Strip ─────────────────────────────────────────────── */}
      <div className="border-y border-[var(--border)] py-3 bg-[var(--bg-alt)] overflow-hidden">
        <div className="ticker-track">
          {[...Array(3)].map((_, gi) => (
            <span key={gi} className="flex items-center gap-6 px-6 whitespace-nowrap text-xs font-medium text-[var(--ink-3)] uppercase tracking-widest">
              {['1000+ Companies', 'YC Backed', 'Remote Roles', '3000+ Jobs', 'AI Matching', 'Series A & B', 'Founder Profiles', 'Pre-seed to Growth'].map((t, i) => (
                <span key={i} className="flex items-center gap-6">
                  {t}<span className="text-[var(--teal)]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ─── Features ─────────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 lg:px-8 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-20">
            <div className="section-label mb-6">Why Foundry</div>
            <h2 className="font-serif text-4xl md:text-5xl text-[var(--ink)] tracking-tight max-w-2xl mx-auto">
              Built for the way{' '}
              <em className="text-[var(--teal)]">engineers actually search.</em>
            </h2>
            <p className="mt-4 text-[var(--ink-2)] max-w-lg mx-auto leading-relaxed">
              No noise. No spam. Just signal — startup companies worth joining, and tools to help you stand out.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <SectionReveal key={f.title} delay={i * 0.1}>
                <div className="card-double-border p-8 h-full flex flex-col group">
                  <div className="w-11 h-11 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--teal)] mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:border-[rgba(13,115,119,0.3)]">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl text-[var(--ink)] mb-3 group-hover:text-[var(--teal)] transition-colors leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed mt-auto">{f.desc}</p>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Dark "How it Works" Section ──────────────────────────────── */}
      <section className="dark-section py-28 px-6 lg:px-8 relative overflow-hidden border-b border-[rgba(255,255,255,0.06)]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(13,115,119,0.15),transparent_50%)] pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <SectionReveal>
            <div className="mb-6 font-sans font-bold text-[var(--teal)] uppercase tracking-[0.15em] text-[11px]">
              How it works
            </div>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight leading-[1.05] max-w-lg text-white mb-20">
              Three steps.<br />
              <em className="text-white/70 italic">One great role.</em>
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Upload your resume', desc: 'Drop your PDF or DOCX and we extract your skills, experience, and projects automatically.' },
              { n: '02', title: 'Browse & filter', desc: 'Explore companies by stage, batch, industry, and tech stack. Filter jobs by role, location, and salary.' },
              { n: '03', title: 'Get matched', desc: 'Receive ranked job matches based on your skill profile. Apply directly or save for later.' },
            ].map((step, i) => (
              <SectionReveal key={step.n} delay={i * 0.12}>
                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 hover:bg-white/[0.05] transition-colors duration-400 overflow-hidden group">
                  <div className="absolute -right-3 -bottom-8 font-serif text-[10rem] text-white/[0.025] leading-none select-none pointer-events-none group-hover:text-white/[0.04] transition-colors duration-400">
                    {step.n}
                  </div>
                  <div className="relative z-10">
                    <div className="font-serif text-xl text-[var(--teal)] mb-4 opacity-80">{step.n}</div>
                    <h3 className="font-serif text-2xl text-white mb-3 leading-tight">{step.title}</h3>
                    <p className="text-white/55 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Company Showcase ─────────────────────────────────────────── */}
      <section className="py-28 px-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-4">Companies Hiring Now</div>
              <h2 className="font-serif text-3xl md:text-4xl text-[var(--ink)] tracking-tight">
                Explore the companies
              </h2>
            </div>
            <Link href="/companies" className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-[var(--teal)] hover:gap-2.5 transition-all">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </SectionReveal>

          {/* Horizontal scroll */}
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
            {DUMMY_COMPANIES.map((company, i) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="shrink-0 w-64"
              >
                <Link href={`/companies/${company.id}`}>
                  <div className="card-double-border p-5 h-full cursor-pointer">
                    <div className="w-10 h-10 rounded bg-[var(--teal-light)] border border-[var(--border)] flex items-center justify-center mb-3">
                      <span className="font-serif italic text-[var(--teal)] text-sm font-bold">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="font-serif text-base text-[var(--ink)] leading-tight mb-1">{company.name}</h3>
                    <p className="text-xs text-[var(--ink-3)] mb-3 line-clamp-2">{company.tagline}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[var(--ink-4)]">{company.batch || company.stage}</span>
                      <span className="flex items-center gap-1 text-xs text-[var(--teal)]">
                        <Briefcase className="w-3 h-3" />
                        {company.openJobsCount} roles
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <SectionReveal className="text-center mb-14">
            <div className="section-label mb-4">Testimonials</div>
            <h2 className="font-serif text-4xl text-[var(--ink)] tracking-tight">
              Engineers found their next role here
            </h2>
          </SectionReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <SectionReveal key={t.name} delay={i * 0.1}>
                <div className="card-double-border p-6 h-full flex flex-col">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 text-[var(--teal)] fill-[var(--teal)]" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--ink-2)] leading-relaxed flex-1 mb-4 italic">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-xs font-semibold">
                      {t.initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--ink)]">{t.name}</p>
                      <p className="text-xs text-[var(--ink-3)]">{t.role}</p>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionReveal>
            <div className="dark-section rounded-3xl p-12 md:p-16 text-center relative overflow-hidden border border-[rgba(255,255,255,0.06)]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(13,115,119,0.15),transparent)] pointer-events-none" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 border border-white/20 rounded-full px-3 py-1 text-xs text-white/70 mb-6">
                  <TrendingUp className="w-3 h-3" />
                  Join 10,000+ engineers
                </div>
                <h2 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-4">
                  Your next role,<br /><em className="text-white/70 italic">starts here.</em>
                </h2>
                <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed mb-8">
                  Upload your resume and discover startup opportunities you won&apos;t find anywhere else.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/resume-match"
                    className="flex items-center gap-2 px-6 py-3 bg-white text-[var(--ink)] rounded-full font-medium text-sm hover:bg-[var(--teal)] hover:text-white transition-all"
                  >
                    Upload Resume <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/jobs"
                    className="flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-full font-medium text-sm hover:border-white/50 transition-all"
                  >
                    Browse Jobs
                  </Link>
                </div>
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-[var(--border)] pt-14 pb-8 px-6 sm:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-14">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-[var(--teal)] rounded flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                </div>
                <span className="font-serif italic text-lg text-[var(--ink)]">Foundry Jobs</span>
              </div>
              <p className="text-sm text-[var(--ink-3)] leading-relaxed">
                The startup job platform for software engineers. Discover companies and find roles that match your profile.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-sm text-[var(--ink-3)]">
              {[
                { label: 'Product', links: ['Jobs', 'Companies', 'Resume Match', 'Dashboard'] },
                { label: 'Resources', links: ['Blog', 'Changelog', 'Docs', 'Status'] },
                { label: 'Legal', links: ['Privacy', 'Terms', 'Cookies'] },
                { label: 'Social', links: ['Twitter', 'LinkedIn', 'GitHub'] },
              ].map(col => (
                <div key={col.label}>
                  <p className="font-bold text-[var(--ink)] uppercase tracking-[0.15em] text-[10px] mb-3">{col.label}</p>
                  <ul className="flex flex-col gap-2">
                    {col.links.map(l => (
                      <li key={l}>
                        <a href="#" className="hover:text-[var(--teal)] transition-colors">{l}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[var(--border)] text-xs text-[var(--ink-4)]">
            <span>© 2024 Foundry. All rights reserved.</span>
            <span>Built for engineers, by engineers.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
