
'use client';

import { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { inboxData } from '@/lib/mock-data';
import type { InboxMessage } from '@/lib/types';
import { processEmails } from '@/ai/flows/process-emails-flow';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

const statusInfo: Record<
  InboxMessage['status'],
  { icon: React.ReactNode; color: string; label: string }
> = {
  parsed: {
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-green-400',
    label: 'Parsed',
  },
  unmatched: {
    icon: <HelpCircle className="h-4 w-4" />,
    color: 'text-yellow-400',
    label: 'Unmatched',
  },
  conflict: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-red-400',
    label: 'Conflict',
  },
};

export default function InboxPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      const result = await processEmails();
      toast({
        title: "Sync Complete",
        description: result.message,
      });
    } catch (error) {
      console.error("Failed to sync emails:", error);
      toast({
        variant: "destructive",
        title: "Sync Failed",
        description: "Could not sync with the magic mailbox. Please try again.",
      });
    } finally {
      setIsSyncing(false);
    }
  };


  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            Travel Inbox
          </h1>
          <p className="text-muted-foreground">
            Status of reservations processed from the magic inbox.
          </p>
        </div>
        <Button onClick={handleSync} disabled={isSyncing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync with AI'}</span>
        </Button>
      </header>
      <div className="space-y-4">
        {inboxData.map((message) => (
          <Card key={message.id} className="transition-all hover:bg-secondary/50">
            <CardContent className="flex items-center gap-4 p-4">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary ${
                  statusInfo[message.status].color
                }`}
              >
                {statusInfo[message.status].icon}
              </div>
              <div className="flex-1">
                <p className="font-medium">{message.summary}</p>
                <p className="text-xs text-muted-foreground">
                  From: {message.from} &middot; Received: {message.received}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">
                {statusInfo[message.status].label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
