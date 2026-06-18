'use client';

import { Bell, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/jobs': 'Jobs',
  '/companies': 'Companies',
  '/resume-match': 'Resume Match',
  '/bookmarks': 'Bookmarks',
  '/profile': 'Profile',
};

export default function TopNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const title = PAGE_TITLES[pathname] ?? 'Foundry Jobs';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[var(--bg)] border-b border-[var(--border)]">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-2 md:hidden" />
        <h1 className="font-serif text-xl text-[var(--ink)]">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          id="global-search-trigger"
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true });
            document.dispatchEvent(event);
          }}
          className="flex items-center gap-2 px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-alt)] text-[var(--ink-3)] text-sm hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:block">Search...</span>
          <kbd className="hidden sm:block text-[10px] font-mono bg-[var(--bg)] border border-[var(--border)] rounded px-1 py-0.5">⌘K</kbd>
        </button>
        <button
          id="notifications-btn"
          className="w-8 h-8 flex items-center justify-center rounded-md border border-[var(--border)] text-[var(--ink-3)] hover:border-[var(--teal)] hover:text-[var(--teal)] transition-all"
        >
          <Bell className="w-4 h-4" />
        </button>
        {user ? (
          <Link href="/profile" className="w-8 h-8 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-sm font-semibold hover:opacity-80 transition-opacity">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              (user.firstName?.[0] || user.email[0]).toUpperCase()
            )}
          </Link>
        ) : (
          <Link href="/login" className="text-sm font-medium text-[var(--ink-2)] hover:text-[var(--teal)] px-2 transition-colors">
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
