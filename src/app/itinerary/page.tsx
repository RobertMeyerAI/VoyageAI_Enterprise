'use client';
import { useState, useEffect } from 'react';
import { SegmentCard } from '@/components/segment-card';
import { itineraryData as initialItineraryData, tripTitle } from '@/lib/mock-data';
import type { DayGroup, Segment } from '@/lib/types';
import ItineraryLoading from './loading';
import { getLiveItineraryStatus } from '@/ai/flows/get-live-itinerary-status';

export default function ItineraryPage() {
  const [itinerary, setItinerary] = useState<DayGroup[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const allSegments = initialItineraryData.flatMap(day => day.segments);
        const result = await getLiveItineraryStatus({ segments: allSegments });
        
        const updatedSegmentsById = new Map<string, Segment>();
        result.segments.forEach(segment => {
          updatedSegmentsById.set(segment.id, segment);
        });

        const updatedItinerary = initialItineraryData.map(dayGroup => ({
          ...dayGroup,
          segments: dayGroup.segments.map(segment => updatedSegmentsById.get(segment.id) || segment),
        }));
        
        setItinerary(updatedItinerary);
      } catch (error) {
        console.error("Failed to fetch live itinerary status:", error);
        // Fallback to initial data in case of an error
        setItinerary(initialItineraryData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStatus();
  }, []);

  if (isLoading || !itinerary) {
    return <ItineraryLoading />;
  }

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
      {itinerary.map((dayGroup) => (
        <div key={dayGroup.date} className="flex flex-col gap-4">
          <div className="sticky top-14 md:top-0 z-10 -mx-6 bg-background/80 px-6 py-2 backdrop-blur-sm">
            <h2 className="font-headline text-lg font-semibold text-foreground">
              {dayGroup.day},{' '}
              {new Date(dayGroup.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                timeZone: 'UTC',
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
