'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Zap, Menu, X } from 'lucide-react';
import { Dock, DockIcon } from '@/components/ui/dock';

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
        <div className="hidden md:flex items-center gap-4">
          <Dock className="h-9 p-0 mt-0 bg-transparent border-none shadow-none backdrop-blur-none gap-1" iconSize={28} iconMagnification={38} iconDistance={70}>
            <DockIcon className="bg-transparent hover:bg-[var(--teal-light)] text-[var(--ink-2)] hover:text-[var(--teal)]">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full text-current" aria-label="GitHub">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
            </DockIcon>
            <DockIcon className="bg-transparent hover:bg-[var(--teal-light)] text-[var(--ink-2)] hover:text-[var(--teal)]">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full text-current" aria-label="X (Twitter)">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
            </DockIcon>
            <DockIcon className="bg-transparent hover:bg-[var(--teal-light)] text-[var(--ink-2)] hover:text-[var(--teal)]">
              <a href="mailto:hello@foundry.com" className="flex items-center justify-center w-full h-full text-current" aria-label="Email">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </a>
            </DockIcon>
          </Dock>

         
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
