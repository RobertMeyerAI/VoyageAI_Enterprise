'use server';
/**
 * @fileOverview An AI agent that provides live status updates for an itinerary.
 *
 * - getLiveItineraryStatus - A function that takes itinerary segments and returns them with live-updated statuses.
 * - GetLiveItineraryStatusInput - The input type for the getLiveItineraryStatus function.
 * - GetLiveItineraryStatusOutput - The return type for the getLiveItineraryStatus function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SegmentSchemaForAI = z.object({
  id: z.string(),
  type: z.enum(['flight', 'lodging', 'train', 'ferry', 'bus', 'activity', 'car']),
  status: z.enum(['confirmed', 'delayed', 'cancelled']),
  title: z.string(),
  provider: z.string(),
  confirmationCode: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  startLocation: z.string(),
  endLocation: z.string(),
  startLocationShort: z.string(),
  endLocationShort: z.string(),
  date: z.string().describe("The date of the segment in ISO 8601 format."),
  duration: z.string().optional(),
  details: z.string().optional().describe("A single string summarizing all key details like Gate, Seat, Terminal, etc."),
  media: z.array(z.object({ type: z.enum(['qr', 'pdf']), url: z.string() })).optional(),
});

const GetLiveItineraryStatusInputSchema = z.object({
  segments: z.array(SegmentSchemaForAI).describe('An array of trip segments for the itinerary.'),
});
export type GetLiveItineraryStatusInput = z.infer<typeof GetLiveItineraryStatusInputSchema>;

const GetLiveItineraryStatusOutputSchema = z.object({
  segments: z.array(SegmentSchemaForAI).describe('The array of trip segments with their statuses updated based on live data.'),
});
export type GetLiveItineraryStatusOutput = z.infer<typeof GetLiveItineraryStatusOutputSchema>;


export async function getLiveItineraryStatus(input: GetLiveItineraryStatusInput): Promise<GetLiveItineraryStatusOutput> {
  return getLiveItineraryStatusFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getLiveItineraryStatusPrompt',
  input: {schema: GetLiveItineraryStatusInputSchema},
  output: {schema: GetLiveItineraryStatusOutputSchema},
  prompt: `You are a live travel assistant AI named Voyage AI. Your task is to check the real-time status of a user's itinerary. You have access to live flight tracking, train schedules, and other travel data sources.

Review the following itinerary segments. For each one, update its 'status' field to reflect the most current, real-time information. 
If a segment is delayed, update its 'title' to reflect the delay. If it's on time, you can add a detail like 'On Time'.
Combine all relevant details (like Gate, Seat, New Departure Time, etc.) into a single summary string for the 'details' field.
Do not change any other fields unless necessary to reflect the new status.

Itinerary:
{{{json segments}}}

Return the full list of segments with the updated statuses in the same JSON format.
`,
});

const getLiveItineraryStatusFlow = ai.defineFlow(
  {
    name: 'getLiveItineraryStatusFlow',
    inputSchema: GetLiveItineraryStatusInputSchema,
    outputSchema: GetLiveItineraryStatusOutputSchema,
  },
  async input => {
    // If there are no segments, return an empty array to avoid calling the model with no data.
    if (!input.segments || input.segments.length === 0) {
      return { segments: [] };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
