'use client';

import { useState, useEffect } from 'react';
import { getFounders } from '@/lib/services/api';
import type { Founder } from '@/types/company';
import { useAuth } from '@/lib/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link2, ExternalLink as TwitterIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StaggerContainer, StaggerItem } from '@/components/animations';

export default function FoundersPage() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getFounders().then(data => {
      setFounders(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-sm text-[var(--ink-3)]">Loading founders...</div>;
  }

  const isBlurred = !user;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-serif text-4xl text-[var(--ink)] tracking-tight mb-2">Founders</h1>
        <p className="text-[var(--ink-3)]">Connect with the people behind the startups.</p>
      </motion.div>

      <StaggerContainer className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", isBlurred && "opacity-40 blur-[4px] pointer-events-none select-none grayscale-[20%]")}>
        {founders.map(f => (
          <StaggerItem key={f.id} className="card-double-border p-5 flex items-center gap-4 bg-[var(--bg)]">
            <div className="w-12 h-12 rounded-full bg-[var(--teal)] flex items-center justify-center text-white text-lg font-semibold shrink-0">
              {f.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-medium text-[var(--ink)] truncate">{f.name}</p>
              <p className="text-sm text-[var(--ink-3)] truncate">{f.role}</p>
            </div>
            <div className="flex gap-2">
              {f.linkedin && (
                <a href={f.linkedin} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                  <Link2 className="w-5 h-5" />
                </a>
              )}
              {f.twitter && (
                <a href={f.twitter} target="_blank" rel="noopener noreferrer" className="text-[var(--ink-4)] hover:text-[var(--teal)] transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
