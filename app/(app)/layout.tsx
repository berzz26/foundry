import Sidebar from '@/components/layout/Sidebar';
import TopNav from '@/components/layout/TopNav';
import MobileNav from '@/components/layout/MobileNav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar />
        <SidebarInset>
          <div className="flex flex-col min-w-0 min-h-screen">
            <TopNav />
            <main className="flex-1 p-6 pb-24 md:pb-6">
              {children}
            </main>
          </div>
          {/* Mobile Bottom Nav */}
          <MobileNav />
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
