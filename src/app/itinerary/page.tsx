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
      <div className="flex flex-col gap-4">
        {trips.map((trip) => (
          <Link href={`/itinerary/${trip.id}`} key={trip.id} className="group">
            <Card className="flex flex-col sm:flex-row overflow-hidden transition-all group-hover:bg-secondary/50">
              <div className="relative h-40 w-full sm:h-auto sm:w-48 flex-shrink-0">
                <Image
                  src={trip.image.url}
                  alt={trip.title}
                  fill
                  className="object-cover"
                  data-ai-hint={trip.image.aiHint}
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h2 className="text-lg font-semibold">{trip.title}</h2>
                  </div>
                  <div className="text-sm text-muted-foreground mt-2">
                    <Calendar className="mr-2 h-4 w-4 inline-block" />
                    <span>{formatDateRange(trip.startDate, trip.endDate)}</span>
                  </div>
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
