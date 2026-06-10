'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Briefcase, Building2, FileText, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOBILE_NAV = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/resume-match', label: 'Match', icon: FileText },
  { href: '/bookmarks', label: 'Saved', icon: Bookmark },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden bg-[var(--bg)] border-t border-[var(--border)]">
      {MOBILE_NAV.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors',
              isActive ? 'text-[var(--teal)]' : 'text-[var(--ink-3)]'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
