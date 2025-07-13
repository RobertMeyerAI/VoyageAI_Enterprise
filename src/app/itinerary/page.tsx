import Link from 'next/link';
import { getTrips } from '@/lib/data';
import type { Trip } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import * as icons from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import { tripsData as mockTripsData } from '@/lib/mock-data';

function formatDateRange(startDate: Timestamp, endDate: Timestamp) {
  const start = startDate.toDate();
  const end = endDate.toDate();

  const startMonth = start.toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const startDay = start.getUTCDate();
  const endMonth = end.toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const endDay = end.getUTCDate();

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

export default async function ItineraryListPage() {
  let trips = await getTrips();

  // If Firestore fails, use mock data as a fallback.
  if (trips.length === 0) {
    console.log("Using mock data for trips list.");
    trips = mockTripsData.map(trip => ({
      ...trip,
      startDate: Timestamp.fromDate(new Date(trip.startDate)),
      endDate: Timestamp.fromDate(new Date(trip.endDate)),
    }));
  }

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
        {trips.map(trip => (
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
