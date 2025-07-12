'use client';
import { useState, useEffect } from 'react';
import { SegmentCard } from '@/components/segment-card';
import type { DayGroup, Segment, Trip } from '@/lib/types';
import ItineraryLoading from '@/app/itinerary/loading';
import { getLiveItineraryStatus } from '@/ai/flows/get-live-itinerary-status';

interface ItineraryViewProps {
  trip: Trip;
  initialItinerary: DayGroup[];
}

export function ItineraryView({ trip, initialItinerary }: ItineraryViewProps) {
  const [itinerary, setItinerary] = useState<DayGroup[]>(initialItinerary);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveStatus = async () => {
      try {
        const allSegments = initialItinerary.flatMap(day => day.segments);
        const allSegmentsForAI = allSegments.map(s => ({
            ...s,
            // Convert timestamp to string for AI flow
            startTime: s.startTime,
            endTime: s.endTime,
            date: s.date.toDate().toISOString(),
        }));
        
        // Ensure we don't send empty requests
        if (allSegmentsForAI.length === 0) {
            setItinerary(initialItinerary);
            setIsLoading(false);
            return;
        }

        const result = await getLiveItineraryStatus({ segments: allSegmentsForAI });
        
        const updatedSegmentsById = new Map<string, Segment>();
        result.segments.forEach(segment => {
          // Find original segment to preserve timestamp object
          const originalSegment = allSegments.find(s => s.id === segment.id);
          if (originalSegment) {
            updatedSegmentsById.set(segment.id, { ...originalSegment, ...segment });
          }
        });

        const updatedItinerary = initialItinerary.map(dayGroup => ({
          ...dayGroup,
          segments: dayGroup.segments.map(segment => updatedSegmentsById.get(segment.id) || segment),
        }));
        
        setItinerary(updatedItinerary);
      } catch (error) {
        console.error("Failed to fetch live itinerary status:", error);
        // Fallback to initial data in case of an error
        setItinerary(initialItinerary);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveStatus();
  }, [initialItinerary]);

  if (isLoading || !itinerary || !trip) {
    return <ItineraryLoading />;
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
          {trip.title}
        </h1>
        <p className="text-muted-foreground">
          Your unified timeline of all reservations for this trip.
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
