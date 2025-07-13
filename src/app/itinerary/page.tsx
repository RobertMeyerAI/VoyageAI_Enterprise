
import { getTrips } from '@/lib/data';
import { TripList } from '@/components/trip-list';
import type { Trip } from '@/lib/types';

export default async function ItineraryListPage() {
  const trips: Trip[] = await getTrips();

  // Serialize Timestamps to Date objects before passing to the client component.
  const serializedTrips = trips.map(trip => ({
    ...trip,
    startDate: trip.startDate.toDate(),
    endDate: trip.endDate.toDate(),
  }));

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            My Trips
          </h1>
          <p className="text-muted-foreground">
            Your upcoming adventures, all in one place.
          </p>
        </div>
      </header>
      <TripList initialTrips={serializedTrips} />
    </div>
  );
}
