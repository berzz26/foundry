"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DeckCard, FounderRecipient, sendOutreachMessage } from '@/lib/api/outreach';
import { Send, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ComposeDMProps {
  card: DeckCard;
  founder: FounderRecipient;
  onClose: () => void;
  onSent: () => void;
}

export function ComposeDM({ card, founder, onClose, onSent }: ComposeDMProps) {
  const [subject, setSubject] = useState(founder.outreach.subject || '');
  const [message, setMessage] = useState(founder.outreach.message || '');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMode, setSuccessMode] = useState<string | null>(null);

  const handleSend = async () => {
    if (!message.trim()) {
      setError('Message cannot be empty.');
      return;
    }

    setIsSending(true);
    setError(null);
    setSuccessMode(null);

    try {
      const response = await sendOutreachMessage(card.outreachId, {
        subject,
        message,
        founderId: founder.founderId,
      });
      
      setSuccessMode(response.mode === 'dry-run' ? 'dry-run' : 'sent');
      setTimeout(() => {
        onSent();
      }, 1500); // Wait a bit to show the success state before calling onSent
    } catch (err: any) {
      console.error('Failed to send outreach:', err);
      setError(err.response?.data?.error || 'Failed to send message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-50 flex flex-col bg-background p-4 sm:p-6 rounded-2xl shadow-xl border border-border overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Send Message</h3>
        <Button variant="ghost" size="icon" onClick={onClose} disabled={isSending}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">To</label>
          <div className="px-3 py-2 bg-muted/50 rounded-md border border-border/50 text-sm">
            <span className="font-medium text-foreground">{founder.founder.fullName}</span>{' '}
            <span className="text-muted-foreground">&lt;{founder.email.address}&gt;</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="subject">Subject</label>
          <Input 
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. following up about the engineering role"
            disabled={isSending || successMode !== null}
          />
        </div>

        <div className="flex flex-col gap-1.5 flex-1">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="message">Message</label>
          <Textarea 
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 min-h-[200px] resize-none font-sans"
            disabled={isSending || successMode !== null}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md border border-destructive/20">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {successMode === 'dry-run' && (
          <div className="flex items-center gap-2 p-3 text-sm text-amber-500 bg-amber-500/10 rounded-md border border-amber-500/20">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p>Sent (dry-run mode — SMTP not configured).</p>
          </div>
        )}

        {successMode === 'sent' && (
          <div className="flex items-center gap-2 p-3 text-sm text-emerald-500 bg-emerald-500/10 rounded-md border border-emerald-500/20">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p>Message sent successfully!</p>
          </div>
        )}
      </div>

      <div className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
        <Button variant="outline" onClick={onClose} disabled={isSending || successMode !== null}>
          Cancel
        </Button>
        <Button onClick={handleSend} disabled={isSending || successMode !== null || !message.trim()} className="min-w-[120px]">
          {isSending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
          {successMode ? 'Sent' : 'Send Message'}
        </Button>
      </div>
    </motion.div>
  );
}
