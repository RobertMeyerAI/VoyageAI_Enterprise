import { notFound } from 'next/navigation';
import type { DayGroup, SerializedTrip, SerializedSegment } from '@/lib/types';
import ItineraryLoading from '../loading';
import { getTrip, getTripSegments } from '@/lib/data';
import { ItineraryView } from '@/components/itinerary-view';
import { tripsData as mockTripsData } from '@/lib/mock-data';
import { Timestamp } from 'firebase/firestore';

export default async function ItineraryPage({
  params,
}: {
  params: { tripId: string };
}) {
  let trip = await getTrip(params.tripId);
  let segments = await getTripSegments(params.tripId);

  // Fallback to mock data if Firestore fails
  if (!trip || segments.length === 0) {
    console.log(`Using mock data for trip: ${params.tripId}`);
    const mockTrip = mockTripsData.find(t => t.id === params.tripId);
    if (mockTrip) {
      trip = {
        id: mockTrip.id,
        title: mockTrip.title,
        icon: mockTrip.icon,
        startDate: Timestamp.fromDate(new Date(mockTrip.startDate)),
        endDate: Timestamp.fromDate(new Date(mockTrip.endDate)),
      };
      segments = mockTrip.itinerary.flatMap(day => 
        day.segments.map(seg => ({
          ...seg,
          date: Timestamp.fromDate(new Date(day.date))
        }))
      );
    }
  }

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
