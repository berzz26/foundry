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
  LogOut,
  Users,
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import { useAuth } from '@/lib/contexts/AuthContext';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/jobs', label: 'Jobs', icon: Briefcase },
  { href: '/companies', label: 'Companies', icon: Building2 },
  { href: '/founders', label: 'Founders', icon: Users },
  { href: '/resume-match', label: 'Resume Match', icon: FileText },
  { href: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar className="border-r border-[var(--border)] bg-[var(--bg)]">
      <SidebarHeader className="py-6 px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/icon.png" alt="Foundry Logo" className="w-10 h-10 object-contain shrink-0" />
          <span className="font-serif text-lg text-[var(--ink)] italic">
            Foundry
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-4)] mb-2 px-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + '/');
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton 
                      isActive={isActive} 
                      render={<Link href={href} className="flex items-center gap-3 w-full" />}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-[var(--border)] flex flex-col gap-3">
        <div className="px-3 py-2 rounded-md bg-[var(--teal-light)] border border-[rgba(13,115,119,0.12)]">
          <p className="text-[11px] font-semibold text-[var(--teal)] mb-0.5">Coming in V2</p>
          <p className="text-[11px] text-[var(--ink-3)]">Outreach, Founder CRM, and Cold Email Generator</p>
        </div>
        {user && (
          <button 
            onClick={() => logout()}
            className="flex items-center gap-2 text-sm text-[var(--ink-3)] hover:text-red-500 transition-colors px-2 py-1"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
