
'use server';
/**
 * @fileOverview A Genkit flow for extracting structured travel segment data from an email body.
 *
 * - extractSegmentFromEmail - Parses an email to find travel information.
 * - ExtractSegmentFromEmailInput - The input type for the extractSegmentFromEmail function.
 * - ExtractSegmentFromEmailOutput - The return type for the extractSegmentFromEmail function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Based on the Segment type in src/lib/types.ts, but simplified for AI extraction.
// Dates and times are strings, as the AI will extract them as text.
const ExtractedSegmentSchema = z.object({
    type: z.enum(['flight', 'lodging', 'train', 'ferry', 'bus', 'activity', 'car']).describe("The type of travel segment."),
    status: z.enum(['confirmed', 'delayed', 'cancelled']).default('confirmed').describe("The status of the booking."),
    title: z.string().describe("A descriptive title for the segment, e.g., 'Flight to Copenhagen' or 'Absalon Hotel'."),
    provider: z.string().describe("The company providing the service (e.g., 'Scandinavian Airlines', 'Absalon Hotel')."),
    confirmationCode: z.string().describe("The booking confirmation code or number."),
    startTime: z.string().describe("The start time in HH:mm format."),
    endTime: z.string().describe("The end time in HH:mm format."),
    startLocation: z.string().describe("The full start location, address, or airport name."),
    endLocation: z.string().describe("The full end location, address, or airport name."),
    startLocationShort: z.string().describe("A short code for the start location (e.g., airport code 'CDG')."),
    endLocationShort: z.string().describe("A short code for the end location (e.g., airport code 'CPH')."),
    date: z.string().describe("The primary date of the segment in YYYY-MM-DD format."),
    duration: z.string().optional().describe("The duration of the travel segment, if available."),
    details: z.any().optional().describe("An object for additional details like Gate, Seat, Terminal, etc."),
});

const ExtractSegmentFromEmailInputSchema = z.object({
  emailBody: z.string().describe('The full text content of the email to be parsed.'),
});
export type ExtractSegmentFromEmailInput = z.infer<typeof ExtractSegmentFromEmailInputSchema>;


const ExtractSegmentFromEmailOutputSchema = z.object({
    isTravelEmail: z.boolean().describe("Set to true if the email contains travel reservation information, otherwise false."),
    segment: ExtractedSegmentSchema.optional().describe("The extracted travel segment data. Only present if isTravelEmail is true."),
});
export type ExtractSegmentFromEmailOutput = z.infer<typeof ExtractSegmentFromEmailOutputSchema>;


export async function extractSegmentFromEmail(input: ExtractSegmentFromEmailInput): Promise<ExtractSegmentFromEmailOutput> {
  return extractSegmentFromEmailFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractSegmentFromEmailPrompt',
  input: {schema: ExtractSegmentFromEmailInputSchema},
  output: {schema: ExtractSegmentFromEmailOutputSchema},
  prompt: `You are an expert travel assistant. Your task is to analyze the following email content and determine if it contains a travel reservation.

If it is a travel reservation (flight, hotel, train, etc.), extract all the relevant details and return them in a structured format.
If it is not a travel-related email, or if it is a marketing email, a newsletter, or a personal conversation, indicate that it is not a travel email.

Today's date is ${new Date().toLocaleDateString('en-CA')}. Use this to resolve relative dates if necessary.
For lodging, the 'date' should be the check-in date.

Email Content:
---
{{{emailBody}}}
---
`,
});

const extractSegmentFromEmailFlow = ai.defineFlow(
  {
    name: 'extractSegmentFromEmailFlow',
    inputSchema: ExtractSegmentFromEmailInputSchema,
    outputSchema: ExtractSegmentFromEmailOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
