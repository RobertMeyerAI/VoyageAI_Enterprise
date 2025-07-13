
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addSegmentFromEmail, getTripSegments } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Loader2, Wand2 } from 'lucide-react';
import { extractSegmentFromEmail } from '@/ai/flows/extract-segment-from-email-flow';
import type { SerializedSegment } from '@/lib/types';

const ParseEmailSchema = z.object({
  emailBody: z.string().min(50, 'Email content seems too short to be a reservation.'),
});

type ParseEmailData = z.infer<typeof ParseEmailSchema>;

export function ParseEmailForm({ tripId }: { tripId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<ParseEmailData>({
    resolver: zodResolver(ParseEmailSchema),
    defaultValues: {
      emailBody: '',
    },
  });

  const onSubmit = (data: ParseEmailData) => {
    startTransition(async () => {
      try {
        // Fetch existing segments to check for duplicates
        const existingSegmentsResult = await getTripSegments(tripId);
        const serializedSegments: SerializedSegment[] = existingSegmentsResult.map(segment => ({
            ...segment,
            date: segment.date.toDate().toISOString(),
        }));

        const extractionResult = await extractSegmentFromEmail({ 
            emailBody: data.emailBody,
            existingSegments: serializedSegments,
        });

        if (!extractionResult.isTravelEmail || !extractionResult.segment) {
          toast({
            variant: 'destructive',
            title: 'No Reservation Found',
            description: "The AI couldn't find any travel information in the text you provided.",
          });
          return;
        }

        if (extractionResult.isDuplicate) {
            toast({
              variant: 'default',
              title: 'Duplicate Reservation',
              description: "This reservation appears to already be in your itinerary.",
            });
            return;
        }

        await addSegmentFromEmail(tripId, extractionResult.segment);

        toast({
          title: 'Success!',
          description: `New segment "${extractionResult.segment.title}" has been added.`,
        });
        form.reset();
        setIsOpen(false);
      } catch (error: any) {
        toast({
          variant: 'destructive',
          title: 'Uh oh! Something went wrong.',
          description: error.message || 'There was a problem parsing the email.',
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Wand2 className="mr-2 h-4 w-4" />
          <span>Parse from Email</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Parse Reservation from Email</DialogTitle>
          <DialogDescription>
            Paste the full content of your reservation email below. The AI will extract the details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="emailBody"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email Content</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your full email content here..."
                      className="min-h-[250px] font-code text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Parse Email
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
