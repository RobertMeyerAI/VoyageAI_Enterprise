'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { trips } from '@/lib/mock-data';
import type { Trip } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Sparkles } from 'lucide-react';
import { generateTripImage } from '@/ai/flows/generate-trip-image';

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

function TripCard({ trip }: { trip: Trip }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const generateImage = async () => {
      try {
        const result = await generateTripImage({
          title: trip.title,
          destination: trip.itinerary[0]?.segments[0]?.endLocation || trip.title,
          details: `A trip from ${trip.startDate} to ${trip.endDate}. Key activities might include exploring cities, nature, and local culture.`,
        });
        setImageUrl(result.imageDataUri);
      } catch (error) {
        console.error(`Failed to generate image for trip ${trip.id}:`, error);
        // Fallback to the original placeholder image on error
        setImageUrl(trip.image.url);
      }
    };

    generateImage();
  }, [trip]);

  return (
    <Link href={`/itinerary/${trip.id}`} className="group">
      <Card className="flex flex-col sm:flex-row overflow-hidden transition-all group-hover:bg-secondary/50">
        <div className="relative h-40 w-full sm:h-auto sm:w-48 flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={trip.title}
              fill
              className="object-cover"
              data-ai-hint={trip.image.aiHint}
            />
          ) : (
            <Skeleton className="h-full w-full" />
          )}
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
  );
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
          <TripCard key={trip.id} trip={trip} />
        ))}
      </div>
    </div>
  );
}
