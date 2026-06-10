'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/jobs', label: 'Jobs' },
  { href: '/companies', label: 'Companies' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function PublicNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full flex justify-center pt-5 pb-3 px-4">
      <nav
        className={`flex items-center justify-between px-4 py-2.5 pr-3 rounded-full w-full max-w-5xl transition-all duration-300 ${
          scrolled
            ? 'bg-[rgba(250,250,247,0.85)] backdrop-blur-xl border border-[var(--border)] shadow-[var(--shadow-float)]'
            : 'bg-transparent'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pl-1">
          <div className="w-7 h-7 bg-[var(--teal)] rounded flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-serif italic text-lg text-[var(--ink)]">Foundry</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--ink-2)]">
          {NAV_LINKS.map(l => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--teal)] transition-colors">
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/resume-match"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--ink)] text-white text-sm font-medium hover:bg-[var(--teal)] transition-colors"
          >
            <span>Upload Resume</span>
          </Link>
        </div>

        {/* Mobile menu toggle */}
        <button
          id="mobile-menu-btn"
          className="md:hidden p-2 rounded-md text-[var(--ink-2)] hover:text-[var(--teal)] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-[72px] left-4 right-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl shadow-[var(--shadow-hover)] p-4 flex flex-col gap-2 md:hidden">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-[var(--ink-2)] hover:bg-[var(--teal-light)] hover:text-[var(--teal)] transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[var(--border)]">
            <Link
              href="/resume-match"
              onClick={() => setMenuOpen(false)}
              className="block text-center px-4 py-2.5 rounded-lg bg-[var(--ink)] text-white text-sm font-medium"
            >
              Upload Resume
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
