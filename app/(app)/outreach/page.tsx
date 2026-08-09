import { Metadata } from 'next';
import { SwipeDeck } from '@/components/outreach/SwipeDeck';

export const metadata: Metadata = {
  title: 'Outreach - Foundry',
  description: 'Swipe through top roles and message founders directly.',
};

export default function OutreachPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <SwipeDeck />
    </div>
  );
}
