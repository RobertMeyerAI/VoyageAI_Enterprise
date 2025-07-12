'use client';
import { SegmentCard } from '@/components/segment-card';
import { itineraryData, tripTitle } from '@/lib/mock-data';

export default function ItineraryPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          {tripTitle}
        </h1>
        <p className="text-muted-foreground">
          Your unified timeline of all reservations.
        </p>
      </header>
      {itineraryData.map((dayGroup) => (
        <div key={dayGroup.date} className="flex flex-col gap-4">
          <div className="sticky top-14 md:top-0 z-10 -mx-6 bg-background/80 px-6 py-2 backdrop-blur-sm">
            <h2 className="font-headline text-lg font-semibold text-foreground">
              {dayGroup.day},{' '}
              {new Date(dayGroup.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </h2>
          </div>

          <div className="grid gap-4">
            {dayGroup.segments.map((segment) => (
              <SegmentCard key={segment.id} segment={segment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
