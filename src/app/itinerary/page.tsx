'use client';

import Link from 'next/link';
import { trips } from '@/lib/mock-data';
import type { Trip } from '@/lib/types';
import {
  Card,
} from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import * as icons from 'lucide-react';

function formatDateRange(startDateStr: string, endDateStr: string) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const startDay = startDate.getUTCDate();
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
  const endDay = endDate.getUTCDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
}

function TripCard({ trip }: { trip: Trip }) {
  const LucideIcon = icons[trip.icon as keyof typeof icons] as React.ElementType;

  return (
    <Link href={`/itinerary/${trip.id}`} className="group">
      <Card className="flex items-center p-3 overflow-hidden transition-all group-hover:bg-secondary/50">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mr-4">
          {LucideIcon && <LucideIcon className="h-5 w-5" />}
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h2 className="font-semibold">{trip.title}</h2>
          </div>
          <div className="text-sm text-muted-foreground mt-1">
            <Calendar className="mr-1.5 h-4 w-4 inline-block" />
            <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function ItineraryListPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          My Trips
        </h1>
        <p className="text-muted-foreground">
          Your upcoming adventures, all in one place.
        </p>
      </header>
      <div className="flex flex-col gap-4">
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
