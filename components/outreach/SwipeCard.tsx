"use client";

import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion';
import { DeckCard, FounderRecipient } from '@/lib/api/outreach';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Building, ExternalLink, Briefcase, Mail, AlertCircle } from 'lucide-react';
import { ComposeDM } from './ComposeDM';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

interface SwipeCardProps {
  card: DeckCard;
  isActive: boolean;
  onSwipeLeft: (cardId: string) => void;
  onSwipeRight: (cardId: string) => void;
}

export function SwipeCard({ card, isActive, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const x = useMotionValue(0);
  const controls = useAnimation();
  const [composeFounder, setComposeFounder] = useState<FounderRecipient | null>(null);
  
  // Tie rotation and opacity to the drag distance (x)
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const [aboutExpanded, setAboutExpanded] = useState(false);
  const cardKey = `${card.outreachId}`;

  const handleDragEnd = async (e: any, info: PanInfo) => {
    const threshold = 120;
    if (info.offset.x > threshold) {
      // Swiped right -> Interested / Next
      await controls.start({ x: 300, opacity: 0, transition: { duration: 0.3 } });
      onSwipeRight(cardKey);
    } else if (info.offset.x < -threshold) {
      // Swiped left -> Skip -> Next card
      await controls.start({ x: -300, opacity: 0, transition: { duration: 0.3 } });
      onSwipeLeft(cardKey);
    } else {
      // Return to center
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    }
  };

  const handleComposeClose = () => {
    setComposeFounder(null);
    // User cancelled sending. They can swipe again.
  };

  const handleSent = () => {
    setComposeFounder(null);
    onSwipeRight(cardKey);
  };

  // Company logo placeholder or URL
  const companyLogo = card.company.logoUrl || null;
  const founderAvatar = (f: FounderRecipient) => f.founder.avatarUrl || null;

  // Format currency
  const formatSalary = (min?: number | null, max?: number | null) => {
    if (!min && !max) return null;
    const format = (n: number) => `$${Math.round(n / 1000)}k`;
    if (min && max) return `${format(min)} - ${format(max)}`;
    return min ? `${format(min)}+` : `Up to ${format(max!)}`;
  };

  const renderDot = (valid: boolean | null | undefined) => {
    if (valid === true) return <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" title="SMTP Valid" />;
    if (valid === false) return <span className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" title="SMTP Invalid" />;
    return <span className="w-2 h-2 rounded-full bg-muted-foreground flex-shrink-0" title="Unknown Validity" />;
  };

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
      style={{ zIndex: isActive ? 10 : 0 }}
    >
      <motion.div
        className="relative w-full max-w-[420px] md:max-w-5xl h-[750px] max-h-[85vh] md:h-[72vh] bg-card rounded-3xl shadow-2xl border border-border flex flex-col md:flex-row overflow-hidden pointer-events-auto"
        style={{ x, rotate, opacity }}
        drag={isActive && !composeFounder ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        animate={controls}
      >
        <div className="flex-1 overflow-y-auto no-scrollbar pb-[100px] md:pb-0 md:border-r border-border flex flex-col bg-muted/5">
          {/* 1. Company Section */}
          <div className="p-6 border-b border-border bg-muted/10 shrink-0">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="w-16 h-16 rounded-xl border border-border">
                {companyLogo && <AvatarImage src={companyLogo} alt={card.company.name} className="object-cover" />}
                <AvatarFallback className="rounded-xl text-lg font-bold">
                  {card.company.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-xl font-bold">{card.company.name}</h2>
                  {card.company.batch && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-xs bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-900">
                      {card.company.batch}
                    </Badge>
                  )}
                </div>
                {card.company.tagline && (
                  <p className="text-sm text-muted-foreground leading-tight line-clamp-2">
                    {card.company.tagline}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
              {card.company.location && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <MapPin className="w-3 h-3" /> {card.company.location}
                </div>
              )}
              {card.company.industry && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <Building className="w-3 h-3" /> {card.company.industry}
                </div>
              )}
              {card.company.teamSize && (
                <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md">
                  <Users className="w-3 h-3" /> {card.company.teamSize}
                </div>
              )}
              {card.company.isHiring && (
                <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-md">
                  <Briefcase className="w-3 h-3" /> Hiring
                </div>
              )}
            </div>

            {card.company.description && (
              <div className="text-sm">
                <div className={`text-foreground/90 ${aboutExpanded ? '' : 'line-clamp-3'}`}>
                  {card.company.hiringDescription || card.company.description}
                </div>
                {(card.company.hiringDescription || card.company.description).length > 150 && (
                  <button 
                    onClick={() => setAboutExpanded(!aboutExpanded)} 
                    className="text-primary text-xs font-medium mt-1 hover:underline"
                  >
                    {aboutExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 2. Job Section */}
          <div className="p-6 shrink-0">
            {card.job ? (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> Open Role
                </h3>
                <div className="mb-2">
                  <h4 className="text-lg font-semibold">{card.job.title}</h4>
                  <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                    {card.job.prettyEngType && <span>{card.job.prettyEngType}</span>}
                    {card.job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {card.job.location}</span>}
                    {card.job.remote && <span>Remote: {card.job.remote}</span>}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-3 text-sm font-medium">
                  {formatSalary(card.job.salaryMin, card.job.salaryMax) && (
                    <div className="text-emerald-600 dark:text-emerald-400">
                      {formatSalary(card.job.salaryMin, card.job.salaryMax)}
                    </div>
                  )}
                  {card.job.equityMin !== null && (
                    <div className="text-blue-600 dark:text-blue-400">
                      Eq: {card.job.equityMin}% {card.job.equityMax ? `- ${card.job.equityMax}%` : ''}
                    </div>
                  )}
                </div>

                {card.job.skills && card.job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {card.job.skills.slice(0, 5).map((skill, idx) => (
                      <Badge key={`${skill}-${idx}`} variant="outline" className="text-[10px] py-0">{skill}</Badge>
                    ))}
                    {card.job.skills.length > 5 && <Badge variant="outline" className="text-[10px] py-0">+{card.job.skills.length - 5}</Badge>}
                  </div>
                )}
                
                {card.job.jobUrl && (
                  <a href={card.job.jobUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 inline-flex mt-2">
                    View Role <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-muted-foreground text-center opacity-70">
                <AlertCircle className="w-8 h-8 mb-2" />
                <p className="text-sm font-medium">No active roles matched</p>
                <p className="text-xs">Outreach is exploratory</p>
              </div>
            )}
          </div>
        </div>

        {/* Right side panel for desktop */}
        <div className="w-full md:w-[400px] flex flex-col shrink-0 bg-card">
          {/* 3. Founders Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4" /> {card.founders.length > 1 ? 'Founders' : 'Founder'}
            </h3>
            {card.founders.map((f) => (
              <div key={f.founderId} className="border border-border rounded-2xl bg-muted/10 p-4 flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12 border border-border shrink-0">
                    {founderAvatar(f) && <AvatarImage src={founderAvatar(f)!} alt={f.founder.fullName} className="object-cover" />}
                    <AvatarFallback>{f.founder.firstName?.[0]}{f.founder.lastName?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-semibold text-lg truncate">{f.founder.fullName}</h4>
                      <div className="flex gap-1 shrink-0">
                        {f.founder.linkedin && (
                          <a href={f.founder.linkedin} target="_blank" rel="noreferrer" className="p-1.5 bg-muted rounded-full hover:bg-muted/80 text-muted-foreground hover:text-[#0A66C2] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                        {f.founder.twitter && (
                          <a href={f.founder.twitter} target="_blank" rel="noreferrer" className="p-1.5 bg-muted rounded-full hover:bg-muted/80 text-muted-foreground hover:text-[#1DA1F2] transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                    {f.founder.bio && (
                      <p className="text-xs text-muted-foreground truncate">{f.founder.bio.split('.')[0]}</p>
                    )}
                  </div>
                </div>

                {f.founder.bio && (
                  <p className="text-sm text-foreground/80 line-clamp-3">{f.founder.bio}</p>
                )}

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5 bg-muted/60 px-2 py-1 rounded-full border border-border/50 max-w-full overflow-hidden">
                    <Mail className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
                    <span className="truncate font-medium">{f.email.address}</span>
                    {renderDot(f.email.smtpValid)}
                  </div>
                  {f.email.confidence && (
                    <span className="text-muted-foreground whitespace-nowrap">{f.email.confidence}% match</span>
                  )}
                </div>

                <div
                  className="bg-muted/50 rounded-xl p-3 border border-border/50 relative overflow-hidden group cursor-pointer"
                  onClick={() => setComposeFounder(f)}
                >
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <p className="text-xs text-muted-foreground font-medium mb-1 line-clamp-1">
                    Subject: {f.outreach.subject}
                  </p>
                  <p className="text-sm font-sans italic text-foreground/80 line-clamp-2">
                    &ldquo;{f.outreach.message}&rdquo;
                  </p>
                </div>

                <Button className="w-full font-semibold rounded-xl" size="lg" onClick={() => setComposeFounder(f)}>
                  Edit & Send
                </Button>
              </div>
            ))}
          </div>
        </div>

        {composeFounder && (
          <ComposeDM card={card} founder={composeFounder} onClose={handleComposeClose} onSent={handleSent} />
        )}
      </motion.div>
    </motion.div>
  );
}
