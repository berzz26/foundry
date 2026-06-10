'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  FileText,
  Bookmark,
  User,
  Zap,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/resume-match', label: 'Resume Match', icon: FileText },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
];

// V2 Reserved — not exposed yet
// { href: '/outreach', label: 'Outreach', icon: Mail },
// { href: '/crm', label: 'Founder CRM', icon: Users },

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar flex flex-col py-6 px-3">
      {/* Logo */}
      <div className="px-3 mb-8">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 bg-[var(--teal)] rounded flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="font-serif text-lg text-[var(--ink)] italic">
            Foundry
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5">
        <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2">
          Navigation
        </p>
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn('sidebar-link', isActive && 'active')}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
              {isActive && (
                <ChevronRight className="w-3 h-3 ml-auto text-[var(--teal)] opacity-60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto pt-4 border-t border-[var(--border)]">
        <div className="px-3 py-2 rounded-md bg-[var(--teal-light)] border border-[rgba(13,115,119,0.12)]">
          <p className="text-[11px] font-semibold text-[var(--teal)] mb-0.5">Coming in V2</p>
          <p className="text-[11px] text-[var(--ink-3)]">Outreach, Founder CRM, and Cold Email Generator</p>
        </div>
      </div>
    </aside>
  );
}
