import { notFound } from 'next/navigation';
import type { DayGroup, SerializedTrip, SerializedSegment } from '@/lib/types';
import ItineraryLoading from '../loading';
import { getTrip, getTripSegments } from '@/lib/data';
import { ItineraryView } from '@/components/itinerary-view';
import { NewSegmentForm } from '@/components/new-segment-form';

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

  // Serialize data for Client Component
  const serializedTrip: SerializedTrip = {
    ...trip,
    startDate: trip.startDate.toDate().toISOString(),
    endDate: trip.endDate.toDate().toISOString(),
  };

  const serializedSegments: SerializedSegment[] = segments.map(segment => ({
    ...segment,
    date: segment.date.toDate().toISOString(),
  }));


  // Group segments by date
  const dayGroups: DayGroup[] = serializedSegments.reduce((acc: DayGroup[], segment) => {
    const dateStr = new Date(segment.date).toISOString().split('T')[0];
    const dayName = new Date(segment.date).toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

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

  // Sort day groups by date
  dayGroups.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return <ItineraryView trip={serializedTrip} initialItinerary={dayGroups} />;
}
