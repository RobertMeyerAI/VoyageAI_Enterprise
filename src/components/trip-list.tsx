
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { deleteTrip } from '@/lib/data';
import type { Trip } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MoreVertical,
  Trash2,
  Pencil,
  Loader2,
} from 'lucide-react';
import * as icons from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

// The Trip type received here has serialized Date objects
type SerializedTrip = Omit<Trip, 'startDate' | 'endDate'> & {
  startDate: Date;
  endDate: Date;
};


function formatDateRange(startDate: Date, endDate: Date) {
  const startMonth = startDate.toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const startDay = startDate.getUTCDate();
  const endMonth = endDate.toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  });
  const endDay = endDate.getUTCDate();

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
}

function TripCard({ trip }: { trip: SerializedTrip }) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const LucideIcon = trip.icon
    ? (icons[trip.icon as keyof typeof icons] as React.ElementType)
    : icons.Plane;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTrip(trip.id);
      toast({
        title: 'Trip Deleted',
        description: `"${trip.title}" has been successfully deleted.`,
      });
      // The parent component will handle re-fetching or removing the trip from its state
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete the trip. Please try again.',
      });
      setIsDeleting(false);
    }
    // No need to set isAlertOpen to false, as the dialog will close on action
  };

  return (
    <Card className="flex items-center p-2 transition-all hover:bg-secondary/50">
      <Link href={`/itinerary/${trip.id}`} className="flex flex-1 items-center gap-3 group">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          {LucideIcon && <LucideIcon className="h-5 w-5" />}
        </div>
        <div className="flex-1">
          <h2 className="font-semibold">{trip.title}</h2>
          <div className="text-sm text-muted-foreground mt-1 flex items-center">
            <Calendar className="mr-1.5 h-4 w-4" />
            <span>
              {formatDateRange(trip.startDate, trip.endDate)}
            </span>
          </div>
        </div>
      </Link>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500 focus:text-red-500"
              onSelect={(e) => {
                e.preventDefault();
                setIsAlertOpen(true);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your trip
              and all of its associated segments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

export function TripList({ initialTrips }: { initialTrips: SerializedTrip[] }) {
    // We can manage the list of trips here if needed for dynamic updates
    // For now, we'll just render the initial list passed as props.
    // In a more complex scenario, we might use state and effects here.
    return (
        <div className="flex flex-col gap-4">
            {initialTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
            ))}
        </div>
    );
}
