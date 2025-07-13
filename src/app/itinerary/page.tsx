
import { getTrips } from '@/lib/data';
import { NewTripForm } from '@/components/new-trip-form';
import { TripList } from '@/components/trip-list';
import type { Trip } from '@/lib/types';

export default async function ItineraryListPage() {
  const trips: Trip[] = await getTrips();

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
        <NewTripForm />
      </header>
      <TripList initialTrips={trips} />
    </div>
  );
}
