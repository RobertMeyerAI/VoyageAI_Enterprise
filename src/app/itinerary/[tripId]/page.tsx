import { notFound } from 'next/navigation';
import { SegmentCard } from '@/components/segment-card';
import type { DayGroup, Segment } from '@/lib/types';
import ItineraryLoading from '../loading';
import { getTrip, getTripSegments } from '@/lib/data';
import { ItineraryView } from '@/components/itinerary-view';

export default async function ItineraryPage({
  params,
}: {
  params: { tripId: string };
}) {
  const trip = await getTrip(params.tripId);
  const segments = await getTripSegments(params.tripId);

  if (!trip) {
    notFound();
  }

  // Group segments by date
  const dayGroups: DayGroup[] = segments.reduce((acc: DayGroup[], segment) => {
    const segmentDate = segment.date.toDate();
    const dateStr = segmentDate.toISOString().split('T')[0];
    const dayName = segmentDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

    let dayGroup = acc.find(g => g.date === dateStr);
    if (!dayGroup) {
      dayGroup = {
        date: dateStr,
        day: dayName,
        segments: [],
      };
      acc.push(dayGroup);
    }
    dayGroup.segments.push(segment);
    return acc;
  }, []);

  return <ItineraryView trip={trip} initialItinerary={dayGroups} />;
}
