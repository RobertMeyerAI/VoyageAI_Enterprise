
'use client';

import { useState, useTransition, useEffect } from 'react';
import Link from 'next/link';
import { deleteTrip, updateTrip, addTrip } from '@/lib/data';
import type { Trip, NewTripData } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MoreVertical,
  Trash2,
  Pencil,
  Loader2,
  X,
  Check,
  Calendar as CalendarIcon,
  PlusCircle,
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NewTripSchema } from '@/lib/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// The Trip type received here has serialized Date objects
type SerializedTrip = Omit<Trip, 'startDate' | 'endDate'> & {
  startDate: Date;
  endDate: Date;
};

// We add an optional isNew flag for the inline creation form
type DisplayTrip = SerializedTrip & { isNew?: boolean };


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

interface TripCardProps {
  trip: DisplayTrip;
  onCancelNew?: () => void;
  onTripAdded?: () => void;
}

function TripCard({ trip, onCancelNew, onTripAdded }: TripCardProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(trip.isNew || false);
  const [isPending, startTransition] = useTransition();

  const LucideIcon = trip.icon
    ? (icons[trip.icon as keyof typeof icons] as React.ElementType)
    : icons.Plane;

  const form = useForm<NewTripData>({
    resolver: zodResolver(NewTripSchema),
    defaultValues: trip.isNew ? {
        title: '',
        startDate: undefined,
        endDate: undefined,
    } : {
      title: trip.title,
      startDate: trip.startDate,
      endDate: trip.endDate,
    },
  });

  // Reset form values if the trip prop changes, but only if not editing a new trip
  useEffect(() => {
    if (!trip.isNew) {
        form.reset({
          title: trip.title,
          startDate: trip.startDate,
          endDate: trip.endDate,
        });
    }
  }, [trip, form]);


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
  };

  const handleFormSubmit = (data: NewTripData) => {
    startTransition(async () => {
        try {
            if (trip.isNew) {
                await addTrip(data);
                toast({
                    title: 'Success!',
                    description: `Trip "${data.title}" has been created.`,
                });
                onTripAdded?.();
            } else {
                await updateTrip(trip.id, data);
                toast({
                    title: 'Success!',
                    description: `Trip "${data.title}" has been updated.`,
                });
                setIsEditing(false);
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Uh oh! Something went wrong.',
                description: trip.isNew ? 'There was a problem creating your trip.' : 'There was a problem updating your trip.',
            });
        }
    });
  };

  const handleCancel = () => {
    if (trip.isNew) {
        onCancelNew?.();
    } else {
        setIsEditing(false);
        form.reset({ // Reset form to original values
            title: trip.title,
            startDate: trip.startDate,
            endDate: trip.endDate,
        });
    }
  }

  if (isEditing) {
    return (
        <Card className="p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel className="sr-only">Title</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g., Summer in Scandinavia" />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className='flex gap-2'>
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick a start date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full pl-3 text-left font-normal",
                                            !field.value && "text-muted-foreground"
                                        )}
                                        >
                                        {field.value ? (
                                            format(field.value, "PPP")
                                        ) : (
                                            <span>Pick an end date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={field.value}
                                        onSelect={field.onChange}
                                        initialFocus
                                    />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
                            <X className="mr-2 h-4 w-4" /> Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            Save
                        </Button>
                    </div>
                </form>
            </Form>
        </Card>
    )
  }

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
            <DropdownMenuItem onSelect={() => setIsEditing(true)}>
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
    const [trips, setTrips] = useState<DisplayTrip[]>(initialTrips);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        // Only update if not currently adding a new trip
        if (!isAdding) {
            setTrips(initialTrips);
        }
    }, [initialTrips, isAdding]);

    const handleAddNew = () => {
        setIsAdding(true);
    };
    
    const handleCancelNew = () => {
        setIsAdding(false);
    }
    
    const handleTripAdded = () => {
        setIsAdding(false);
        // Revalidation should handle refetching, but we can clear the local state
        // to be sure we get the fresh list.
    }

    return (
        <div className="flex flex-col gap-4">
            {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
            ))}
            {isAdding && (
                <TripCard 
                    trip={{ id: 'new', title: '', startDate: new Date(), endDate: new Date(), isNew: true }} 
                    onCancelNew={handleCancelNew}
                    onTripAdded={handleTripAdded}
                />
            )}
             <Button 
                variant="outline" 
                className="mt-2 w-full border-dashed" 
                onClick={handleAddNew}
                disabled={isAdding}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Trip
            </Button>
        </div>
    );
}
