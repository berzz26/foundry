"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileJson, Check } from 'lucide-react';
import { DeckCard } from '@/lib/api/outreach';
import { cn } from '@/lib/utils';

interface CopyMetaButtonProps {
  card: DeckCard;
  className?: string;
}

export function CopyMetaButton({ card, className }: CopyMetaButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(JSON.stringify(card, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={handleCopy}
      className={cn('shrink-0', copied && 'text-emerald-500', className)}
      title={copied ? 'Copied!' : 'Copy card meta (JSON)'}
      aria-label={copied ? 'Copied!' : 'Copy card meta (JSON)'}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <FileJson className="w-3.5 h-3.5" />}
    </Button>
  );
}
