import Link from 'next/link';
import Image from 'next/image';
import { trips } from '@/lib/mock-data';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from 'lucide-react';

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <Link href={`/itinerary/${trip.id}`} key={trip.id} className="group">
            <Card className="flex h-full flex-col overflow-hidden transition-all group-hover:scale-[1.02] group-hover:shadow-lg">
              <div className="relative h-40 w-full">
                <Image
                  src={trip.image.url}
                  alt={trip.title}
                  fill
                  className="object-cover"
                  data-ai-hint={trip.image.aiHint}
                />
              </div>
              <CardHeader>
                <CardTitle>{trip.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1" />
              <CardFooter className="text-sm text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                {formatDateRange(trip.startDate, trip.endDate)}
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
